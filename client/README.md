# パチンコ店舗 3Dパース自動生成デモ（フロントエンド）

React クライアントは、パチンコ店舗の内外観 3D パースを自動生成するワークフローを疑似体験できるデモ UI です。情報収集 → レンダリング結果の確認 → VR 表示まで、営業〜デザイン部署が顧客へ提案する流れをブラウザ上で再現します。

## ユースケース概要

1. **要件ヒアリング**  
   CAD 図面や仕上表などの資料をアップロードし、ターゲット層・想定時間帯などを入力します。
2. **AI レンダリング**  
   事前に用意したプリセット画像を Stable Diffusion の推論結果として扱い、マテリアルや照明を調整しながら複数アングルを比較します。
3. **成果物共有**  
   高解像度レンダリングのダウンロード、生成結果のバルク書き出し、VR 用 360° 動画での確認が可能です。

## 画面フロー

| ステップ | URL | 主な機能 |
|----------|-----|-----------|
| Setup    | `/` | 図面アップロード、プロジェクト概要入力、入力ガイド表示、次ステップへのバリデーション |
| Preview  | `/preview` | レンダーギャラリー、マテリアル／ライティング調整、トーンプリセット、比較モード、ZIP 書き出し |
| VR Viewer | `/preview/vr` | 選択中レンダーの 360° 動画プレビュー、VR ファイルの存在チェック |

## 主な UI 機能

- **図面アップロード** (`UploadCard`)  
  ドラッグ＆ドロップ／クリック選択双方に対応し、アップロード済み画像をプレビュー表示します。

- **制作要件フォーム** (`SetupForm`)  
  必要図面数・仕上表 URL・想定客層など、入力補助ツールチップ付きでヒアリング項目を網羅します。

- **レンダー一覧とタグ切り替え** (`GalleryColumn`)  
  `public/renders` 配下の画像セットから、選択中のアングルやバルク選択を管理します。

- **トーン・比較調整** (`PreviewColumn`)  
  露出・彩度などをスライダーで調整し、`single / split / slider` の比較モードで変化を確認できます。

- **マテリアル／照明プリセット** (`AdjustmentColumn`)  
  床材・天井材などの差し替えや、色温度・照度プリセットを適用してバリエーションを検証します。

- **ダウンロード機能**  
  選択中のレンダーをフィルター適用後の状態で単体保存、または複数枚を ZIP 化して一括保存します。

- **VR プレビュー** (`VRViewerPage`)  
  選択アングルに対応する `*_vr.mp4` を自動で解決し、360° 動画として再生します。

## 技術スタック

- **UI**: React 18, Chakra UI, React Router
- **状態管理**: Zustand (`useRenderingDemoStore`)
- **ユーティリティ**: JSZip, FileSaver
- **スタティックアセット**: `public/renders` に静的画像／動画を配置

## ディレクトリ構造（抜粋）

```
src/
  components/
    rendering-demo/
      RenderingDemoPage.js      // プレビュー画面のレイアウト
      GalleryColumn.js          // 画像ギャラリー
      PreviewColumn.js          // メインプレビュー＆比較
      AdjustmentColumn.js       // 調整パネル
      tabs/                     // マテリアル・ライティング等の詳細 UI
      VRViewerPage.js           // VR 表示画面
    setup/SetupPage.js          // 初期ヒアリング画面
  lib/rendering-demo/           // プリセットデータ群
  store/useRenderingDemoStore.js // Zustand ストアとドメインロジック
```

## 状態とデータモデル

`useRenderingDemoStore` は、以下のドメイン状態を一元管理します。

- `projectBrief`: ユーザーが入力する制作要件
- `uploadedFloorPlan`: 図面画像の ObjectURL とファイル名
- `activeSetId`, `selectedRenderId`: 表示中のレンダーセットと選択アングル
- `toneFilters`, `materialVariantsByShot`, `lighting`: 調整パラメータの集合
- `comparisonMode`: `single / split / slider` の比較方式
- `selectedRenderIds`: ZIP 書き出し対象のバルク選択状態
- `getActiveShots`, `getShotWithVariants`: アセットと調整値を合成するドメイン関数

プリセットは `lib/rendering-demo` 以下に集約しており、UI レイヤーからは依存関係が一方向になるよう設計されています。

## ダミーアセットについて

- 静的画像は `public/renders/{setId}/*.png` の形式で配置されています。
- VR 動画は同ディレクトリに `{ファイル名}_vr.mp4` を置くと自動解決されます。
- 実運用ではバックエンドで生成したアセットを同構造でホストする想定です。

## 今後の拡張メモ

- バックエンド API と連携し、Stable Diffusion による実レンダリングと差し替え
- 図面アップロード時の EXIF・メタデータ解析
- 生成パラメータの保存とバージョン管理

本 README は、クライアントアプリの全体像と UI 振る舞いを把握するためのドキュメントです。ビルドやセットアップ手順はリポジトリ直下の `README.md` を参照してください。
