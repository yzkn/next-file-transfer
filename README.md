# next-file-transfer

P2Pファイル共有

---

## initialization

```powershell
yarn create next-app .
```

> √ Would you like to use TypeScript? ... No
>
> √ Would you like to use ESLint? ... Yes
>
> √ Would you like to use Tailwind CSS? ... Yes
>
> √ Would you like your code inside a `src/` directory? ... Yes
>
> √ Would you like to use App Router? (recommended) ... Yes



> √ Would you like to use Turbopack for `next dev`? ... No

※既定値はYesだが、設定すると実行時に以下のエラーが発生するので変更

```
FATAL: An unexpected Turbopack error occurred. Please report the content of *****.log, along with a description of what you were doing when the error occurred, to https://github.com/vercel/next.js/issues/new
[Error [TurbopackInternalError]: Next.js package not found
```



> √ Would you like to customize the import alias (`@/*` by default)? ... No



## 動作確認

```powershell
yarn dev
```

>    ▲ Next.js 15.1.8
>
>    - Local:        http://localhost:3000
>
>    - Network:      http://192.168.0.40:3000



## 静的エクスポート

```powershell
yarn add -D serve
```

- package.json

```plaintext
  "scripts" 内

    "serve": "yarn build && serve ./out"
```

- next.config.mjs

```plaintext
nextConfig 内

    output: 'export',
```

```powershell
yarn serve
```

---

Copyright (c) 2025 YA-androidapp(https://github.com/yzkn) All rights reserved.
