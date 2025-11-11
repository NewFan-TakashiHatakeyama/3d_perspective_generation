# Stable Diffusion

このプロジェクトは、[Stable Diffusion](https://github.com/CompVis/stable-diffusion)深層学習モデルを使用して画像を生成するAPIとReactアプリケーションで構成されています。APIが画像を生成し、Reactアプリケーションがそれをユーザーに表示します。

## 必要条件

### API

- Python 3.7+
- PyTorch 1.7+
- FastAPI
- transformers
- pillow
- fastapi-cors

### React UI

- Node.js
- npm

## 開発環境のセットアップ

### Docker環境（推奨）

1. 環境変数の設定:
   ```bash
   # .envファイルを作成
   # Windowsの場合
   echo HUGGINGFACE_TOKEN=your_token_here > .env

   # macOS/Linuxの場合
   echo "HUGGINGFACE_TOKEN=your_token_here" > .env
   ```

   注意: `your_token_here` は、[Hugging Face](https://huggingface.co/settings/tokens)から取得した実際のアクセストークンに置き換えてください。
   トークンが正しく設定されていないと、モデルのダウンロードに失敗します。

2. Dockerコンテナのビルドと起動:
   ```bash
   docker-compose up --build
   ```

アプリケーションは以下のURLでアクセスできます：
- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:8000

### 従来の方法

#### API

1. `pip install -r requirements.txt` で必要な依存関係をインストール
2. `auth_token.py` 内の `auth_token` 変数に[Hugging Faceアクセストークン](https://huggingface.co/settings/tokens)を設定
3. `uvicorn main:app --reload` でサーバーを起動

#### React UI

1. `npm install` で必要な依存関係をインストール
2. `npm start` で開発サーバーを起動
3. http://localhost:3000/ でアプリケーションにアクセス可能

## 使用方法

1. ブラウザで `http://localhost:3000/` にアクセスすると、トップページが表示されます。画面中央にプロンプト入力フィールドと画像ギャラリーが並んでいます。
2. 「プロンプト」入力欄に、生成したい画像の雰囲気や内容（例: *"夕暮れの海辺を歩くロボット"*）を自然文で入力します。プロンプトは日本語・英語どちらでも構いません。
3. 左側または上部にあるオプションパネルで、スタイルやショットタイプ、解像度などのプリセットを選択できます。選択内容はプレビューカードに即座に反映されます。
4. 入力とオプション設定が完了したら、「生成」ボタンをクリックします。ボタンの右側に進行状況インジケーターが表示され、生成中は再クリックできません。
5. 生成が完了すると、結果のサムネイルがギャラリーに追加されます。サムネイルをクリックすると、モーダルウィンドウが開き、拡大表示・ダウンロード・お気に入り保存などの操作が行えます。
6. 過去に生成した画像はギャラリー上部のタブでカテゴリー分けされており、切り替えることで簡単に比較できます。不要な画像は各サムネイル右上の削除アイコンで整理してください。
7. エラーが発生した場合は画面下部に赤いトースト通知が表示されます。メッセージ内容を確認し、プロンプトの内容やトークン設定を見直してください。再度「生成」ボタンを押すと再試行できます。

## デプロイメント

### Docker環境の特徴

1. **APIサービス (Python/FastAPI)**
   - PyTorch with CUDA対応
   - GPUサポート有効（nvidia-docker必要）
   - ホットリロード対応（開発モード）
   - 環境変数でHugging Face token設定可能

2. **クライアントサービス (React)**
   - マルチステージビルドで最適化
   - Nginxで本番環境用にサーブ
   - APIプロキシ設定済み
   - 開発モードでホットリロード対応

### 従来の方法

#### API

APIは[Heroku](https://www.heroku.com/)などのホスティングサービスにデプロイできます。高速な画像生成を実現するために、HerokuアプリにGPUインスタンスを追加することを推奨します。

#### React UI

`npm run build`を実行すると、`build`フォルダに本番用ビルドが作成されます。このビルドは[Netlify](https://www.netlify.com/)などのホスティングサービスにデプロイできます。

## 注意事項

1. GPUを使用する場合は、nvidia-dockerのインストールが必要です。
2. 本番環境にデプロイする際は、セキュリティ設定を適切に行ってください。
3. Hugging Face tokenは必ず.envファイルで管理し、直接コードに書かないでください。

## 謝辞

このプロジェクトは、[Stability AI](https://stability.ai/)と[Runway ML](https://runwayml.com/)によって訓練されたStable Diffusionモデルを使用しています。モデルは[GitHub](https://github.com/CompVis/stable-diffusion)で公開されています。

## ライセンス

このプロジェクトはMITライセンスの下で公開されています - 詳細は[LICENSE](LICENSE)ファイルを参照してください。