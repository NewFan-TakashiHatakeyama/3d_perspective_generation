# 1) 画面構成（デモ版 | 情報設計）

* **/rendering-demo**（シングルページ完結、3カラム構成を踏襲し役割を再定義）

  * **左カラム：レンダー結果一覧（ギャラリー）**
    * 図面アップロード（任意・プレビュー表示）
    * 画像セットセレクタ（例：`setA`, `setB`）
    * タグベースのフィルタ（全景 / 入口 / 島 / 出口 / 台クローズアップ / 夜景 …）
    * サムネイルカード（タイトル・撮影条件：アングル/時間帯/焦点距離・チェックボックス）
    * 複数選択で右上 `選択画像をダウンロード` ボタンが有効化

  * **中央カラム：プレビュー & 比較**
    * メインプレビュー（拡大・パン）
    * Before/After 比較（トグル or スライダー）
    * プリセットボタン（昼景 / 夕景 / 夜景 / ビビッド）
    * 将来拡張用 `VRで見る` プレースホルダ（WebXR 起動想定）

  * **右カラム：編集パネル（タブ構成）**
    * タブ：`色・トーン` / `材質 Variant` / `照明 (Lights)` / `カメラ` / `出力`
    * 各タブはプリセット＋数値スライダーの二段構え

* **ステップ表示**（ヘッダーまたは右上）：`① 画像セット選択 → ② プレビュー＆編集 → ③ 出力`

> バックエンドレスを前提に、静的3Dパース画像は `public/renders/{setId}/xx_*.jpg` で提供。将来 glTF / WebXR に発展させても UI 文言と構成が破綻しない語彙を採用する。

# 2) コンポーネント設計（粒度と責務）

**レイアウト系**

* `DemoShell`：ヘッダー / 3カラムレイアウト / ステップ表示
* `RenderGalleryColumn`：検索＋タグ＋サムネ＋一括DLボタン
* `PreviewColumn`：単体プレビュー＋比較ビュー＋VRプレースホルダ
* `AdjustmentColumn`：タブ UI、各タブにセクションカード＋コントロール群

**アップロード＆画像管理**

* `FloorPlanUploader`：図面画像のドラッグ&ドロップ、`URL.createObjectURL` プレビュー
* `RenderSetSelector`：画像セット切替（非同期フェッチ無し、静的配列）
* `RenderCard`：タグ・撮影条件・複数選択トグル・個別DL
* `GalleryFilterBar`：タグフィルタリング（Material Design Image Lists 準拠）

**プレビュー＆比較**

* `RenderPreview`：拡大・パン対応の単体表示
* `RenderComparison`：Before/After トグル、スライダー比較
* `PresetChips`：ワンタップでフィルタ適用
* `VrLaunchButton`：WebXR プレースホルダ（後で実装差し替え）

**編集タブ構成**

* `ToneTab`：CSS filter スライダー（Brightness / Contrast / Saturate / Hue / Sepia / Blur）
* `MaterialTab`：床・壁・什器ごとの Material Variant ドロップダウン
* `LightsTab`：昼 / 夕 / 夜プリセット＋強度・色温度・影 ON/OFF（KHR_lights_punctual を意識した UI）
* `CameraTab`：アングルプリセット・焦点距離・露出（EV）
* `ExportTab`：単体DL / ZIP DL / Altテキスト編集 / メタ情報表示

**状態管理**

* `useRenderingDemoStore`（Zustand）：クライアント内部状態のみ
  * `activeSetId`, `uploadedFloorPlan`, `selectedRenderIds`
  * `currentFilters`, `activePreset`, `materialVariantsByShot`, `lighting`, `camera`
  * `comparisonMode`（Single / Split / Slider）

# 3) Next.js 構成（App Router | フロントのみ）

```
app/
  layout.tsx
  rendering-demo/
    page.tsx                // デモ画面本体（Client Component）
public/
  renders/
    setA/
      01_overview.jpg
      02_entrance.jpg
      ...
    setB/ ...               // 追加想定
components/
  rendering-demo/
    DemoShell.tsx
    FloorPlanSidebar.tsx
    RenderGallery.tsx
    AdjustmentsPanel.tsx
  ui/
    Button.tsx
    Slider.tsx ...
lib/
  rendering-demo/
    presets.ts              // フィルタプリセット定義
    filters.ts              // CSS filter 生成ロジック
    assets.ts               // セットID → 画像メタ
store/
  useRenderingDemoStore.ts  // Zustand
styles/ (Tailwind)
```

* すべて Client Component。サーバー通信不要。
* 画像は Next.js の `public` から配信し、`next/image` で最適化可。
* 将来 glTF へ拡張する際は `PreviewColumn` を three.js / WebXR 対応コンポーネントに置換可能な構造にする。

# 4) フィルタ調整ロジック & 型

* `ToneFilters` 型：`brightness`, `contrast`, `saturate`, `hue`, `sepia`, `blur`
* `MaterialVariantSelection` 型：`floor`, `wall`, `fixture` などのキーに対する `variantId`
* `LightingState` 型：`preset`（昼/夕/夜）、`intensity`, `temperature`, `castShadow`
* `CameraState` 型：`preset`, `fov`, `exposure`, `focusDistance`
* プレビュー反映は `style={{ filter: cssFilterString }}`、比較ビューにも同じ CSS filter を適用
* 出力は `canvas.getContext("2d").filter = cssFilterString` → `toBlob` → `file-saver`、ZIP は JSZip

```ts
// lib/rendering-demo/filters.ts
export type ToneFilters = {
  brightness: number;
  contrast: number;
  saturate: number;
  hue: number;
  sepia: number;
  blur: number;
};

export const DEFAULT_TONE_FILTERS: ToneFilters = {
  brightness: 1,
  contrast: 1,
  saturate: 1,
  hue: 0,
  sepia: 0,
  blur: 0,
};

export const TONE_PRESETS: Record<string, Partial<ToneFilters>> = {
  Neutral: {},
  "Day / Cool": { brightness: 1.05, contrast: 1.05, saturate: 1.05, hue: -5 },
  "Evening / Warm": { brightness: 1.03, contrast: 1.08, saturate: 1.12, sepia: 0.15, hue: 10 },
  "Night / Vibrant": { brightness: 0.95, contrast: 1.15, saturate: 1.25, hue: 5 },
};

export function toCssFilter(f: ToneFilters) {
  return `
    brightness(${f.brightness})
    contrast(${f.contrast})
    saturate(${f.saturate})
    hue-rotate(${f.hue}deg)
    sepia(${f.sepia})
    blur(${f.blur}px)
  `.replace(/\s+/g, " ").trim();
}
```

# 5) デモ用データモデル（フロント内完結）

* `RenderShot` 型：`id`, `label`, `src`, `tags`, `meta`（`angle`, `timeOfDay`, `focalLength`）
* `RenderSet`：セットIDごとに `RenderShot[]` を定義
* `MaterialVariant` 型：`id`, `label`, `previewColor`, `description`
* `LightingPreset` 型：`id`, `label`, `intensity`, `temperature`, `castsShadow`
* `CameraPreset` 型：`id`, `label`, `fov`, `exposure`
* `useRenderingDemoStore`

```ts
// lib/rendering-demo/assets.ts
import type { RenderShot } from "./types";

export const RENDER_SETS: Record<string, RenderShot[]> = {
  setA: [
    {
      id: "01",
      label: "店舗全景",
      src: "/renders/setA/01_overview.jpg",
      tags: ["overview", "day"],
      meta: { angle: "Aerial wide", timeOfDay: "Day", focalLength: 24 },
    },
    {
      id: "02",
      label: "入口",
      src: "/renders/setA/02_entrance.jpg",
      tags: ["entrance", "day"],
      meta: { angle: "Entrance eye-level", timeOfDay: "Day", focalLength: 28 },
    },
    // ...
  ],
};
```

# 6) UIスタック & 追加ライブラリ

* **Tailwind CSS + shadcn/ui + lucide-react**：統一感ある UI を高速に構築
* **Zustand**：軽量なクライアント状態管理
* **JSZip + file-saver**：ZIP 一括出力
* **react-use-gesture / framer-motion（任意）**：プレビューのパン / スムーズな比較演出
* 将来 3D ビューアを入れる場合は `three.js` + `@react-three/fiber`（VR なら `@react-three/xr`）を `PreviewColumn` に組み込む

# 7) ユースケース（デモ挙動）

1. 図面アップロード（任意）
   * ローカルファイルを選択 → `URL.createObjectURL` でプレビュー
2. 生成済み3Dパースセット閲覧
   * セット選択 → タグフィルタ → サムネで候補絞り込み
   * 複数選択 → 一括DL準備
3. プレビュー & 編集
   * メインプレビューで拡大しつつプリセット適用
   * Before/After 比較、材質・照明・カメラを調整
4. 出力
   * 単体DL（Canvas 焼き込み）
   * 複数選択 ZIP DL（JSZip 使用）
   * Alt テキスト編集でメタ保存（アクセシビリティ対応）

# 8) 将来拡張ガイドライン

* バックエンド導入時は `render-jobs`, `render-assets` API を追加し、静的画像を動的生成物に差し替え
* glTF 変換時は `KHR_materials_variants`, `KHR_lights_punctual` を UI 用語と対応させ、Material/Lights タブをそのままデータバインディング
* カメラタブのプリセットは three.js / Babylon.js 等に直接マッピング可能（`PerspectiveCamera.fov` など）
* VR ボタンは WebXR の `navigator.xr` チェックで起動、HMD が無い場合のフォールバックメッセージを用意
* InstancedMesh を用いた大量島表示やグループ操作を見据え、ギャラリー側のタグ／グループ選択 UI を今から揃える

---

## まとめ（デモ版）

* **シングルページ構成**で図面選択 → ギャラリー → プレビュー & 編集 → 出力を高速に回す
* Material Variant / Lights / Camera といった 3D 用語を UI に採り入れ、将来 glTF / WebXR 拡張でも破綻しない設計
* **CSS filter + Canvas filter** で軽量なリアルタイム編集＆焼き込み出力を実現
* 将来フル機能版へ移行する際も、DDD / Clean Architecture のレイヤリングを保ちながらバックエンドを追加できる

