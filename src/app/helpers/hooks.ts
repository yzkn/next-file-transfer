import { useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const useAsyncState = (initialValue: any) => {
    const [value, setValue] = useState(initialValue);
    const setter = (x: any) =>
        new Promise<void>(resolve => {
            setValue(x);
            resolve();
        });
    return [value, setter];
}
/* eslint-enable @typescript-eslint/no-explicit-any */