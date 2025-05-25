"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, Col, Input, Menu, MenuProps, message, Row, Space, Upload, UploadFile } from "antd";
import { CopyOutlined, UploadOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { startPeer, stopPeerSession } from "./store/peer/peerActions";
import * as connectionAction from "./store/connection/connectionActions"
import { DataType, PeerConnection } from "./helpers/peer";
import { useAsyncState } from "./helpers/hooks";

import { QRCodeSVG } from 'qrcode.react';
import queryString from 'query-string';

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

export const App: React.FC = () => {

    const peer = useAppSelector((state) => state.peer)
    const connection = useAppSelector((state) => state.connection)
    const dispatch = useAppDispatch()

    const handleStartSession = () => {
        dispatch(startPeer())
    }

    const handleStopSession = async () => {
        await PeerConnection.closePeerSession()
        dispatch(stopPeerSession())
    }

    const handleConnectOtherPeer = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        connection.id != null ? dispatch(connectionAction.connectPeer(connection.id || "")) : message.warning("Please enter ID")
    }

    const [fileList, setFileList] = useAsyncState([] as UploadFile[])
    const [sendLoading, setSendLoading] = useAsyncState(false)

    const handleUpload = async () => {
        if (fileList.length === 0) {
            message.warning("Please select file")
            return
        }
        if (!connection.selectedId) {
            message.warning("Please select a connection")
            return
        }
        try {
            await setSendLoading(true);
            const file = fileList[0] as unknown as File;
            const blob = new Blob([file], { type: file.type });

            await PeerConnection.sendConnection(connection.selectedId, {
                dataType: DataType.FILE,
                file: blob,
                fileName: file.name,
                fileType: file.type
            })
            await setSendLoading(false)
            message.info("Send file successfully")
        } catch (err) {
            await setSendLoading(false)
            console.log(err)
            message.error("Error when sending file")
        }
    }

    const [pid, setStr] = useState("");

    const init = async () => {
        console.log('load');

        console.log('window.location.search', window.location.search);

        const parsed = queryString.parse(window.location.search);
        console.log({ parsed });

        const pid = (parsed?.id || "") as string;
        console.log({ pid });
        handleStartSession();

        if (pid !== "") {
            console.log('if pid', pid);

            setStr(pid);
            console.log('setState()', pid);

            dispatch(connectionAction.changeConnectionInput(pid));
            console.log('changeConnectionInput()', pid);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            dispatch(connectionAction.connectPeer(pid));
            console.log('connectPeer()', pid);
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // if (window.document.readyState === "complete") {
            //     init();
            // } else {
            window.addEventListener("load", init);
            //     return () => {
            //         window.removeEventListener("load", init);
            //     };
            // }
        }
    });

    return (
        <Row justify={"center"} align={"top"}>
            <Col xs={24} sm={24} md={20} lg={16} xl={12}>
                <Card hidden={peer.started}>
                    <Button onClick={handleStartSession} loading={peer.loading}>Start</Button>
                </Card>
                <Card hidden={!peer.started}>
                    <Space direction="vertical">
                        <Space direction="horizontal" size="large">
                            <div>ID: {peer.id}</div>
                            <Button icon={<CopyOutlined />} onClick={async () => {
                                await navigator.clipboard.writeText(peer.id || "")
                                message.info("Copied: " + peer.id)
                            }} />
                            <Button danger onClick={handleStopSession}>Stop</Button>
                        </Space>
                        <Card hidden={pid !== ''}>
                            <Space direction="horizontal" size="large">
                                {/* <QRCodeSVG
                                    value={peer.id || ""}
                                    title={peer.id || ""}
                                    className="w-full h-full p-6"
                                    bgColor="#ffffff"
                                    level="H"
                                /> */}
                                <QRCodeSVG
                                    value={"?id=" + peer.id || ""}
                                    title={"?id=" + peer.id || ""}
                                    className="w-full h-full p-6"
                                    bgColor="#ffffff"
                                    level="H"
                                />
                                <Input placeholder={"URL"}
                                    onFocus={e => e.target.select()}
                                    value={"?id=" + peer.id || ""}
                                />
                                <a
                                    href={"?id=" + peer.id || ""}
                                    rel="noreferrer"
                                    target="_blank">
                                    URL
                                </a>
                            </Space>
                        </Card>
                    </Space>
                </Card>
                <div hidden={!peer.started}>
                    <Card>
                        <Space direction="horizontal" size="large">
                            <Input placeholder={"ID"}
                                onChange={e => { setStr(e.target.value); dispatch(connectionAction.changeConnectionInput(e.target.value)) }}
                                required={true}
                                value={pid}
                            />
                            <Button onClick={handleConnectOtherPeer}
                                loading={connection.loading}>Connect</Button>
                            {
                                connection.list.length === 0
                                    ? <div>Waiting for connection ...</div>
                                    : <div>
                                        Select a connection
                                        <Menu selectedKeys={connection.selectedId ? [connection.selectedId] : []}
                                            onSelect={(item) => dispatch(connectionAction.selectItem(item.key))}
                                            items={connection.list.map(e => getItem(e, e, null))} />
                                    </div>
                            }
                        </Space>
                    </Card>
                    <Card title="Send File">
                        <Upload fileList={fileList}
                            maxCount={1}
                            onRemove={() => setFileList([])}
                            beforeUpload={(file) => {
                                setFileList([file])
                                return false
                            }}>
                            <Button icon={<UploadOutlined />}>Select File</Button>
                        </Upload>
                        <Button
                            type="primary"
                            onClick={handleUpload}
                            disabled={fileList.length === 0}
                            loading={sendLoading}
                            style={{ marginTop: 16 }}
                        >
                            {sendLoading ? 'Sending' : 'Send'}
                        </Button>
                    </Card>
                </div>
            </Col>
        </Row>
    )
}

export default App
