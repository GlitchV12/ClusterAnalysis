# Cluster Analysis & STP Learning Platform

## Product, UX, Architecture, Technical Structure & Delivery Plan

**Status:** Product blueprint / pre-development plan\
**Primary audience:** IIMB students learning clustering, segmentation
and marketing analytics\
**Secondary audience:** Faculty/instructors\
**Frontend:** Vite\
**Primary goal:** Build a fast, simple, interactive clustering-analysis
workspace that teaches students how to move from raw tabular data to
defensible segmentation and STP insights.

------------------------------------------------------------------------

# 1. Product Vision

The product should not feel like a generic machine-learning dashboard.

It should feel like a **guided analytical workspace**:

> Upload data → understand the data → prepare it → explore clustering →
> compare solutions → understand segments → make STP decisions → export
> the analysis.

The system should support two modes of use:

1.  **Guided mode**
    -   Appropriate defaults.
    -   Recommendations.
    -   Plain-language explanations.
    -   Minimal configuration required.
    -   Designed for students who know the marketing problem but may not
        know every technical parameter.
2.  **Advanced mode**
    -   Manual algorithm selection.
    -   Manual cluster count.
    -   Distance/similarity choices.
    -   Preprocessing controls.
    -   Technical metrics.
    -   Detailed methodology.
    -   Designed for students/faculty who want to inspect or control the
        analysis.

The product should teach without becoming a textbook.

A useful rule:

> **Show the decision first. Hide the machinery until the user asks for
> it.**

------------------------------------------------------------------------

# 2. Core Product Principle

The application should answer five questions in order:

### 1. What is in my data?

Dataset structure, variable types, missing values, outliers,
distributions and potential problems.

### 2. What should I do to prepare it?

Scaling, encoding, missing-value treatment, feature selection and other
recommendations.

### 3. What groups exist?

Run appropriate clustering methods and explore different cluster
solutions.

### 4. What do these groups mean?

Profile clusters, identify differentiating variables and inspect the
actual observations.

### 5. What can I do with these groups?

Connect the analysis to segmentation, targeting and positioning.

------------------------------------------------------------------------

# 3. Product Scope

## Primary V1 scope

V1 should support:

-   CSV upload.
-   XLSX/XLS upload if implementation complexity remains reasonable.
-   Dataset preview.
-   Automatic data profiling.
-   Automatic variable-type detection.
-   Identifier detection.
-   Missing-value detection.
-   Duplicate detection.
-   Basic outlier detection.
-   Feature selection.
-   Numerical standardization.
-   Basic categorical encoding.
-   Recommended preprocessing.
-   K-Means.
-   Agglomerative/Hierarchical clustering.
-   DBSCAN.
-   Gaussian Mixture Models if the analytical backend supports it
    cleanly.
-   Automatic candidate comparison.
-   Manual algorithm selection.
-   Manual cluster-count selection where applicable.
-   Euclidean, Manhattan, Cosine and Jaccard where method/data
    compatibility makes sense.
-   Gower distance for mixed-type tabular data if backend implementation
    is reliable.
-   Silhouette score.
-   Davies-Bouldin index.
-   Calinski-Harabasz score.
-   Cluster size comparison.
-   2D visualization.
-   PCA-based visualization.
-   Cluster profiling.
-   "What makes this cluster different?" analysis.
-   Record-level cluster inspection.
-   Basic segmentation interpretation.
-   Basic targeting worksheet.
-   Basic positioning/perceptual-map visualization where appropriate.
-   Export of cleaned/clustered dataset.
-   Export of analysis summary/report.
-   Methodology/explanation panels.
-   Responsive, smooth UI.
-   Fast transitions and progressive loading.

------------------------------------------------------------------------

# 4. V2 Scope

V2 can expand into a stronger teaching and faculty platform:

-   t-SNE and UMAP.
-   More clustering algorithms.
-   K-Medoids.
-   Spectral clustering.
-   More sophisticated mixed-data methods.
-   Text clustering.
-   Embedding-based analysis.
-   Advanced survey analysis.
-   More positioning methods such as MDS.
-   Correspondence analysis where academically appropriate.
-   Assignment/exercise mode.
-   Instructor-created exercises.
-   Instructor controls.
-   Student submission workflows.
-   Saved projects.
-   Versioned analyses.
-   Compare two complete analyses.
-   "What changed?" analysis.
-   Automated report generation.
-   PPT export.
-   Richer STP decision framework.
-   Segment attractiveness scoring.
-   Scenario/"what if" analysis.
-   Cluster stability analysis.
-   Repeatability analysis.
-   Advanced outlier handling.
-   Advanced feature engineering.
-   Collaboration.
-   Cloud persistence/authentication if required.
-   Faculty dashboards.
-   Analytics on student activity.

------------------------------------------------------------------------

# 5. Explicit Non-Goals for V1

Do NOT try to build all of the following initially:

-   Every clustering algorithm.
-   Full statistical analysis software.
-   A general-purpose data science notebook.
-   A full LMS.
-   A CRM.
-   A marketing automation system.
-   A generative-AI marketing strategist.
-   Image clustering.
-   Large-scale NLP.
-   Real-time collaboration.
-   Complex 3D visualizations.
-   Dozens of configuration parameters exposed by default.
-   A giant dashboard with every metric visible simultaneously.
-   Automatic "correct" marketing decisions.
-   A black-box AI that hides the analytical methodology.

The product should be narrow, fast and dependable.

------------------------------------------------------------------------

# 6. V1 User Journey

## Screen 0 --- Landing / Start

Keep this extremely simple.

Primary CTA:

**Start Analysis**

Secondary CTA:

**Load Sample Dataset**

Small supporting text:

> Explore customer segments from your data.

Avoid a marketing-heavy landing page.

------------------------------------------------------------------------

## Screen 1 --- Upload

User can:

-   Drag and drop CSV/XLSX.
-   Browse files.
-   Load a sample dataset.

After upload:

-   Parse file.
-   Validate structure.
-   Show loading state.
-   Do not freeze the interface.

Initial summary:

> **2,431 rows · 18 columns**

Then immediately move to profiling.

------------------------------------------------------------------------

# 7. Screen 2 --- Dataset Overview

This is the first major analytical screen.

Show only the most useful information.

Example:

### Dataset

**2,431 rows**\
**18 columns**

### Data quality

-   Missing: 3.1%
-   Duplicate rows: 0.4%
-   Potential outliers: 4.7%

### Variables

  Type            Count
  ------------- -------
  Numerical          11
  Categorical         5
  Ordinal             2

Then a variable table.

Columns:

-   Variable
-   Detected type
-   Missing
-   Unique values
-   Status

Do not show 20 statistical columns by default.

Allow:

**View details**

for deeper statistics.

------------------------------------------------------------------------

# 8. Variable Classification

The application should classify variables into:

-   Numerical
-   Categorical
-   Binary
-   Ordinal
-   Date/time
-   Identifier
-   Text
-   Unknown

Detection should be deterministic and explainable.

Example:

> `customer_id` was detected as an identifier because it contains unique
> values for 99.9% of rows.

Allow the user to override the classification.

Never silently make destructive decisions.

------------------------------------------------------------------------

# 9. Feature Selection

This should be a first-class step.

Example:

### Variables selected for clustering

-   Age
-   Income
-   Monthly Spend
-   Purchase Frequency
-   Brand Loyalty

### Excluded automatically

`Customer_ID`

Reason:

> Identifier-like variables usually do not represent meaningful
> similarity between observations.

Allow:

**Include anyway**

but warn the user.

Also allow:

-   Select all eligible variables.
-   Select manually.
-   Remove individual variables.

------------------------------------------------------------------------

# 10. Data Preparation

The system should recommend actions rather than silently changing data.

Example:

### Recommended

**Standardize numerical variables**

Why:

> Income has a much larger numeric scale than purchase frequency.
> Without scaling, it could dominate distance calculations.

Buttons:

**Apply**

**Ignore**

For missing values:

> 2 variables contain missing values.

Possible options:

-   Mean/median imputation.
-   Mode for categorical data.
-   Remove rows.
-   Remove variable.
-   Leave unresolved if algorithm permits.

Do not overload users with methods.

Advanced details can be hidden.

------------------------------------------------------------------------

# 11. Preprocessing Pipeline

Internally, preprocessing should be represented as a reproducible
pipeline.

Example:

``` text
Raw Dataset
    ↓
Remove identifier columns
    ↓
Handle missing values
    ↓
Encode categorical variables
    ↓
Standardize numerical variables
    ↓
Feature matrix
    ↓
Clustering
```

Every transformation should be recorded.

This is important for:

-   Reproducibility.
-   Explanations.
-   Report generation.
-   Debugging.
-   Future comparison of analyses.

------------------------------------------------------------------------

# 12. Clustering Experience

Do not begin with an algorithm dropdown.

Primary CTA:

**Find Segments**

The system runs a recommended analysis.

Then show:

### Recommended solution

> **4 clusters**

With a compact explanation:

> This solution provides a strong balance between cluster separation and
> segment size.

Show:

-   Algorithm.
-   Number of clusters.
-   Silhouette score.
-   Cluster sizes.

Then:

**Explore this solution**

and:

**Compare other solutions**

------------------------------------------------------------------------

# 13. Automatic Method Recommendation

The recommendation engine should be rule-based initially.

Do not build an opaque AI recommender for V1.

Example logic:

### K-Means

Recommend when:

-   Primarily numerical features.
-   Data has been appropriately scaled.
-   User wants compact/general-purpose segmentation.
-   No extreme density/outlier structure detected.

### Hierarchical

Recommend when:

-   Dataset is not excessively large.
-   User wants to explore nested relationships.
-   Dendrogram interpretation is useful.

### DBSCAN

Recommend when:

-   Outliers are present.
-   Non-spherical/density-based structure may exist.
-   Dataset characteristics support density clustering.

### Gaussian Mixture

Recommend when:

-   Soft/probabilistic membership is educationally useful.
-   Data appears reasonably continuous.
-   Multiple overlapping groups may exist.

The recommendation should always include:

**Why this was recommended**

------------------------------------------------------------------------

# 14. Automatic Cluster Count

For K-Means and other applicable methods, test a sensible range.

For example:

-   K = 2 through K = 8.

Do not blindly optimize one metric.

Consider:

-   Silhouette.
-   Calinski-Harabasz.
-   Davies-Bouldin.
-   Cluster size.
-   Practical interpretability.

The system should say:

> **4 clusters is the recommended starting point.**

Not:

> **4 clusters is objectively correct.**

Clustering is exploratory. The tool should teach that.

------------------------------------------------------------------------

# 15. Algorithm Comparison

A strong V1 feature.

Example:

  Method            Clusters   Silhouette   Smallest segment Notes
  -------------- ----------- ------------ ------------------ ----------------------
  K-Means                  4         0.62                18% Strong separation
  Hierarchical             4         0.58                14% Similar structure
  DBSCAN           3 + noise         0.41                 6% Sensitive to density
  GMM                      4         0.60                16% Overlapping groups

The table should not become an academic spreadsheet.

Highlight the recommended solution.

------------------------------------------------------------------------

# 16. Distance Metrics

Support where mathematically appropriate:

-   Euclidean.
-   Manhattan.
-   Cosine.
-   Jaccard.
-   Gower.

Do not display every metric for every algorithm.

The UI should filter options according to the selected algorithm and
data.

Example:

> Distance
>
> **Euclidean --- Recommended**
>
> Good general-purpose distance for standardized numerical variables.
>
> Other options: Manhattan Cosine

This prevents invalid combinations.

------------------------------------------------------------------------

# 17. Cluster Visualization

The visualization area should be interactive.

Core controls:

-   X-axis.
-   Y-axis.
-   Color/group by cluster.
-   Zoom.
-   Pan.
-   Hover.
-   Select points.
-   Filter cluster.
-   Show/hide clusters.

Default view:

**PCA 2D projection**

Do not imply that the 2D plot is the original feature space.

Label it:

> PCA projection of clustering space

This distinction is important academically.

------------------------------------------------------------------------

# 18. High-Dimensional Data

For V1:

### PCA

Use as the primary dimensionality-reduction visualization.

V2:

-   UMAP.
-   t-SNE.

These should be treated as visualization methods, not automatically as
the clustering method.

A critical rule:

> Never imply that visual separation in a 2D projection proves that
> clusters are genuinely well separated in the original feature space.

------------------------------------------------------------------------

# 19. Cluster Profile

This should be one of the best screens in the product.

Example:

## Segment 2

**31% of respondents**

### Profile

-   High income.
-   High purchase frequency.
-   High brand loyalty.
-   Above-average spend.

### Most distinctive variables

  Variable               vs overall
  -------------------- ------------
  Brand loyalty                +42%
  Purchase frequency           +31%
  Monthly spend                +24%
  Price sensitivity            -18%

Then:

> **Interpretation**
>
> This segment appears to represent high-value, loyal customers.

The interpretation should be framed as an analytical interpretation, not
absolute truth.

------------------------------------------------------------------------

# 20. "What Makes This Cluster Different?"

This should be a prominent interaction.

When a user clicks a cluster:

**What makes this cluster different?**

The system compares:

-   Cluster mean/median.
-   Overall population mean/median.
-   Standardized difference where appropriate.
-   Category distributions.

Then surfaces the strongest differentiators.

This makes the result understandable without forcing students to inspect
every chart.

------------------------------------------------------------------------

# 21. Record-Level Exploration

Allow:

**View respondents**

Then show the rows belonging to the cluster.

Useful interactions:

-   Search.
-   Sort.
-   Filter.
-   Select record.
-   Highlight record on visualization.

This creates a direct connection between:

> mathematical cluster → real observations.

------------------------------------------------------------------------

# 22. Segmentation Module

Once a solution is selected:

## Segmentation

Answer:

> **What groups exist?**

Show:

-   Number of segments.
-   Segment sizes.
-   Segment profiles.
-   Distinguishing characteristics.
-   Cluster quality.

------------------------------------------------------------------------

# 23. Targeting Module

Do not automatically choose the target.

Instead provide a decision framework.

Example:

## Compare segments

  Criterion            Segment A   Segment B   Segment C
  ------------------ ----------- ----------- -----------
  Size                      High      Medium         Low
  Spend                     High         Low        High
  Growth potential        Medium        High        High
  Accessibility             High      Medium         Low

Then allow the student to assess:

-   Size.
-   Value.
-   Growth.
-   Accessibility.
-   Strategic fit.

The tool can calculate a transparent score if the user chooses weights.

Example:

> Size: 30% Value: 30% Growth: 20% Accessibility: 20%

Result:

> Segment C scores highest under your selected criteria.

This is better than saying:

> "Segment C is the correct target."

------------------------------------------------------------------------

# 24. Positioning Module

For marketing use cases, positioning should be a separate concept.

Potential V1 feature:

### Perceptual map

Use an appropriate dimensionality-reduction method for the selected
variables.

Possible axes:

-   Price ↔ Premium.
-   Traditional ↔ Innovative.

But the axes should not be invented arbitrarily from PCA loadings
without explanation.

Where PCA is used:

Show:

> PC1 explains 37% of variance.
>
> Strong positive contributors: Innovation, Quality.
>
> Strong negative contributor: Price sensitivity.

Then allow the student to interpret/name the dimensions.

For more explicit perceptual positioning, MDS can become a V2 feature.

------------------------------------------------------------------------

# 25. STP Output

Final analytical flow:

``` text
SEGMENTATION
    ↓
Who are the groups?
    ↓
PROFILE
    ↓
What characterizes each group?
    ↓
TARGETING
    ↓
Which segment is attractive and why?
    ↓
POSITIONING
    ↓
How should the selected segment/brand be positioned?
```

This is where the product becomes particularly relevant to marketing
education.

------------------------------------------------------------------------

# 26. AI / Explanation Layer

AI should be an explanation layer, not the analytical engine.

Good uses:

-   Explain an algorithm.
-   Explain a metric.
-   Explain why preprocessing was recommended.
-   Explain why two clusters differ.
-   Convert statistical findings into concise language.
-   Help the student formulate a defensible interpretation.
-   Answer questions about the current analysis.

Bad uses:

-   Inventing clusters.
-   Replacing the clustering engine.
-   Making unsupported marketing claims.
-   Giving a target recommendation without evidence.
-   Hiding methodology.
-   Producing authoritative-sounding nonsense.

A useful architecture:

``` text
Deterministic analytics
        ↓
Structured analytical results
        ↓
Explanation layer
        ↓
Student-facing language
```

The AI should consume structured results rather than raw data whenever
possible.

------------------------------------------------------------------------

# 27. Educational Design

The application should teach through interaction.

Examples:

### Metric explanation

> Silhouette score: 0.62

Click:

**What does this mean?**

Show:

> Higher values generally indicate better separation and cohesion. This
> score suggests reasonably well-separated clusters, but it should not
> be interpreted in isolation.

------------------------------------------------------------------------

### Algorithm explanation

> Why K-Means?

Show:

-   What it optimizes.
-   Its assumptions.
-   Why it fits the current data.
-   Its limitations.

------------------------------------------------------------------------

### Mistake learning

If the student chooses K = 8:

> This solution creates two very small segments. You may be
> over-segmenting the data.

Then:

**Compare with K = 4**

The system should encourage experimentation rather than prevent it.

------------------------------------------------------------------------

# 28. Progressive Disclosure

The application should have three information layers.

## Layer 1 --- Decision

What should I look at?

## Layer 2 --- Explanation

Why is the system saying this?

## Layer 3 --- Technical detail

How exactly was it calculated?

Example:

``` text
Silhouette Score: 0.62

[What does this mean?]

[Technical details]
```

This prevents information overload.

------------------------------------------------------------------------

# 29. UI Philosophy

The interface should be:

-   Minimal.
-   Analytical.
-   Calm.
-   Modern.
-   Fast.
-   Consistent.
-   Data-first.

Avoid:

-   Giant hero graphics.
-   Excessive gradients.
-   Excessive glassmorphism.
-   Neon colors.
-   Huge cards.
-   Decorative charts.
-   Excessive icons.
-   Long paragraphs.
-   Too many sidebars.
-   Dashboard-within-dashboard design.

The user should always know:

1.  Where they are.
2.  What the system found.
3.  What they can do next.

------------------------------------------------------------------------

# 30. Color System

Use only **two primary colors**, plus neutrals.

Recommended palette:

### Primary --- Deep Indigo

`#4F46E5`

Shades:

-   50: `#EEF2FF`
-   100: `#E0E7FF`
-   200: `#C7D2FE`
-   300: `#A5B4FC`
-   400: `#818CF8`
-   500: `#6366F1`
-   600: `#4F46E5`
-   700: `#4338CA`
-   800: `#3730A3`
-   900: `#312E81`

### Secondary --- Teal

`#0F766E`

Shades:

-   50: `#F0FDFA`
-   100: `#CCFBF1`
-   200: `#99F6E4`
-   300: `#5EEAD4`
-   400: `#2DD4BF`
-   500: `#14B8A6`
-   600: `#0D9488`
-   700: `#0F766E`
-   800: `#115E59`
-   900: `#134E4A`

### Neutrals

Use a neutral gray scale for almost everything else:

-   Background: `#F8FAFC`
-   Surface: `#FFFFFF`
-   Border: `#E2E8F0`
-   Primary text: `#0F172A`
-   Secondary text: `#475569`
-   Muted text: `#64748B`

Semantic status colors may be used sparingly:

-   Success: standard green.
-   Warning: standard amber.
-   Error: standard red.

Do not turn the entire interface into a rainbow.

------------------------------------------------------------------------

# 31. Cluster Visualization Colors

This needs special treatment because multiple clusters need
distinguishable colors.

Do not manually invent dozens of brand colors.

Use a restrained categorical palette derived from the primary/secondary
visual language, supplemented only when necessary for
distinguishability.

The UI chrome should remain indigo/teal.

Cluster colors should primarily serve **data interpretation**, not
branding.

------------------------------------------------------------------------

# 32. Typography

Use a clean sans-serif.

Recommended:

**Inter**

Hierarchy:

-   Page title: 24--30px.
-   Section heading: 18--22px.
-   Card title: 15--17px.
-   Body: 14--15px.
-   Supporting text: 12--13px.

Avoid tiny text.

Charts may need 11--13px labels depending on density.

------------------------------------------------------------------------

# 33. Layout

Recommended desktop layout:

``` text
┌─────────────────────────────────────────────────────┐
│ Logo              Project Name          Help / User │
├────────────┬────────────────────────────────────────┤
│            │                                        │
│  Workflow  │             Main Workspace             │
│            │                                        │
│  1 Data    │                                        │
│  2 Prepare │                                        │
│  3 Cluster │                                        │
│  4 STP     │                                        │
│  5 Report  │                                        │
│            │                                        │
└────────────┴────────────────────────────────────────┘
```

Keep the navigation narrow.

The analytical canvas should get most of the screen.

------------------------------------------------------------------------

# 34. Navigation

Use a simple workflow:

1.  **Data**
2.  **Prepare**
3.  **Cluster**
4.  **Understand**
5.  **STP**
6.  **Report**

Do not create 15 top-level navigation items.

------------------------------------------------------------------------

# 35. Animation Philosophy

Animations should communicate state, not decorate the UI.

Use:

-   150--250ms micro-interactions.
-   250--400ms panel transitions.
-   Chart transitions.
-   Smooth cluster selection.
-   Skeleton loading.
-   Progress indicators for expensive analysis.
-   Subtle hover states.
-   Smooth expansion of explanations.

Avoid:

-   Long entrance animations.
-   Excessive bouncing.
-   Parallax.
-   Constant movement.
-   Animating every card.
-   Animations that delay usability.

Suggested animation system:

``` text
fast:     150ms
normal:   200ms
slow:     350ms
```

Use CSS transforms/opacity wherever possible.

------------------------------------------------------------------------

# 36. Performance Philosophy

The product should feel instant even when analysis is not instant.

Important techniques:

-   Web Workers for client-side CPU-heavy operations where applicable.
-   Never block the main UI thread with large computations.
-   Lazy-load expensive visualization libraries.
-   Code splitting.
-   Route-level lazy loading.
-   Virtualized large tables.
-   Debounced filters/search.
-   Memoized derived calculations.
-   Avoid unnecessary React renders.
-   Cache analysis results.
-   Cache transformed datasets.
-   Use incremental/progressive rendering.
-   Avoid rendering thousands of DOM nodes.
-   Prefer Canvas/WebGL for dense visualizations where appropriate.

For large datasets, consider moving computation to a backend worker
rather than forcing everything into the browser.

------------------------------------------------------------------------

# 37. Recommended Technical Stack

## Frontend

-   Vite.
-   React.
-   TypeScript.
-   React Router.
-   Tailwind CSS or a small internal design system.
-   Framer Motion or Motion for UI animation.
-   TanStack Query if backend/network state is needed.
-   Zustand for lightweight client application state.
-   Zod for validation.
-   React Hook Form for configuration forms.

Do not add libraries simply because they are popular.

------------------------------------------------------------------------

# 38. Visualization Stack

Evaluate:

### Primary

-   Apache ECharts or Plotly.

For this product, prioritize:

-   Scatter plots.
-   PCA plots.
-   Histograms.
-   Box plots.
-   Heatmaps.
-   Dendrograms.
-   Interactive tooltips.
-   Zoom/pan.
-   Large-point rendering.

Use one primary visualization system wherever possible.

Do not mix four chart libraries without a strong reason.

------------------------------------------------------------------------

# 39. Data Processing Architecture

There should be a strict separation between:

### UI

What the user sees.

### Application state

What the current project is doing.

### Analytical engine

What calculations are performed.

### Data processing

How data is transformed.

### Export

How results are serialized.

This prevents the application from becoming a collection of UI
components with data science logic scattered everywhere.

------------------------------------------------------------------------

# 40. Recommended Project Structure

Use a feature-oriented architecture rather than one giant `components`
directory.

``` text
cluster-analysis/
│
├── public/
│
├── src/
│   │
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.tsx
│   │   ├── providers.tsx
│   │   └── app.config.ts
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── feedback/
│   │   └── data-display/
│   │
│   ├── features/
│   │   │
│   │   ├── dataset/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types.ts
│   │   │   ├── schemas.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── profiling/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── preprocessing/
│   │   │   ├── components/
│   │   │   ├── pipeline/
│   │   │   ├── recommendations/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── clustering/
│   │   │   ├── components/
│   │   │   ├── algorithms/
│   │   │   ├── metrics/
│   │   │   ├── recommendation/
│   │   │   ├── services/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── visualization/
│   │   │   ├── components/
│   │   │   ├── projections/
│   │   │   ├── charts/
│   │   │   ├── interactions/
│   │   │   └── index.ts
│   │   │
│   │   ├── segmentation/
│   │   │   ├── components/
│   │   │   ├── profiling/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── targeting/
│   │   │   ├── components/
│   │   │   ├── scoring/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── positioning/
│   │   │   ├── components/
│   │   │   ├── projections/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── reports/
│   │   │   ├── components/
│   │   │   ├── generators/
│   │   │   ├── exporters/
│   │   │   └── index.ts
│   │   │
│   │   └── education/
│   │       ├── components/
│   │       ├── explanations/
│   │       ├── glossary/
│   │       └── index.ts
│   │
│   ├── lib/
│   │   ├── csv/
│   │   ├── xlsx/
│   │   ├── math/
│   │   ├── statistics/
│   │   ├── formatting/
│   │   └── validation/
│   │
│   ├── state/
│   │   ├── project.store.ts
│   │   ├── dataset.store.ts
│   │   ├── analysis.store.ts
│   │   └── ui.store.ts
│   │
│   ├── workers/
│   │   ├── clustering.worker.ts
│   │   ├── profiling.worker.ts
│   │   └── preprocessing.worker.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── tokens.css
│   │
│   ├── types/
│   │   ├── dataset.ts
│   │   ├── analysis.ts
│   │   └── common.ts
│   │
│   └── main.tsx
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

------------------------------------------------------------------------

# 41. Why Feature-Based Structure

Do not create:

``` text
components/
  Button.tsx
  Chart.tsx
  Cluster.tsx
  DataTable.tsx
  KMeans.tsx
  Profile.tsx
  ...
```

with business logic spread everywhere.

Instead:

``` text
features/clustering/
```

owns clustering-related behavior.

This makes it easier to:

-   Replace algorithms.
-   Add algorithms.
-   Test features.
-   Understand dependencies.
-   Remove features.
-   Maintain V2.

------------------------------------------------------------------------

# 42. Domain Models

Create explicit types.

For example:

``` ts
type VariableType =
  | "numeric"
  | "categorical"
  | "binary"
  | "ordinal"
  | "datetime"
  | "text"
  | "identifier"
  | "unknown";

interface DatasetColumn {
  id: string;
  name: string;
  detectedType: VariableType;
  userType?: VariableType;
  missingCount: number;
  uniqueCount: number;
  isSelected: boolean;
}

interface ClusterResult {
  algorithm: string;
  clusterCount?: number;
  labels: number[];
  metrics: ClusterMetrics;
  profiles: ClusterProfile[];
}
```

Do not pass loosely typed objects everywhere.

------------------------------------------------------------------------

# 43. Analysis Pipeline Model

Represent an analysis as a reproducible object.

Conceptually:

``` text
Analysis
├── dataset
├── selectedFeatures
├── preprocessingPipeline
├── algorithm
├── parameters
├── distanceMetric
├── result
├── metrics
├── visualization
└── interpretation
```

This allows the same analysis to be:

-   Displayed.
-   Re-run.
-   Compared.
-   Exported.
-   Explained.

------------------------------------------------------------------------

# 44. Keep the Analytical Engine Independent

Do not put K-Means calculations inside React components.

Bad:

``` text
ClusterPage.tsx
    ├── UI
    ├── preprocessing
    ├── kmeans
    ├── metrics
    └── chart preparation
```

Good:

``` text
ClusterPage.tsx
    ↓
clustering service
    ↓
algorithm implementation
    ↓
structured result
    ↓
visualization
```

This is one of the most important architectural rules.

------------------------------------------------------------------------

# 45. Backend vs Browser

For an initial prototype, browser-side processing can be attractive
because:

-   Simple deployment.
-   No server required.
-   Better privacy.
-   Fast feedback for moderate datasets.

But browser-only processing should not become a permanent assumption.

A sensible evolution:

### V1

Client-side for manageable datasets.

Web Workers for heavy computation.

### V2

Optional backend execution for:

-   Large datasets.
-   Advanced algorithms.
-   Saved projects.
-   Instructor features.
-   Shared datasets.
-   More expensive AI operations.

The UI should not care where the computation happened.

------------------------------------------------------------------------

# 46. Worker Architecture

CPU-heavy operations should run outside the main thread.

Example:

``` text
UI
 ↓
Analysis Service
 ↓
Worker
 ├── Profiling
 ├── Preprocessing
 ├── Clustering
 └── Metrics
 ↓
Result
 ↓
UI
```

The worker should communicate using typed messages.

Include:

-   Job ID.
-   Progress.
-   Status.
-   Result.
-   Error.

------------------------------------------------------------------------

# 47. Loading States

Never show a generic:

> Loading...

For expensive operations, show what is happening.

Example:

``` text
Analyzing dataset

✓ Reading data
✓ Profiling variables
✓ Preparing features
● Evaluating cluster solutions
○ Comparing results
```

This makes a 10-second calculation feel intentional.

------------------------------------------------------------------------

# 48. Error Handling

Errors must be understandable.

Bad:

> `TypeError: Cannot read properties of undefined`

Good:

> **We couldn't create clusters from the selected variables.**
>
> The selected features do not contain enough usable variation.
>
> Try selecting additional variables.

Technical details should be available under:

**Technical details**

------------------------------------------------------------------------

# 49. Data Privacy

Because students may upload real datasets:

V1 should preferably process data locally whenever practical.

If data is sent to a backend:

-   Clearly disclose it.
-   Encrypt transport.
-   Avoid unnecessary persistence.
-   Define retention.
-   Avoid sending raw data to an LLM unnecessarily.

For AI explanations, preferably send structured aggregate results rather
than entire datasets.

------------------------------------------------------------------------

# 50. Report Generation

V1 should produce a concise analytical report.

Structure:

``` text
1. Dataset
2. Data preparation
3. Clustering approach
4. Why the method was selected
5. Number of clusters
6. Validation metrics
7. Segment profiles
8. Segment comparison
9. Targeting analysis
10. Positioning visualization
11. Conclusions
```

Allow the student to edit interpretations before export.

Do not let AI silently write the final academic submission.

------------------------------------------------------------------------

# 51. Export

V1:

-   CSV with cluster labels.
-   Analysis summary.
-   PDF if feasible.

V2:

-   PPTX.
-   Excel workbook.
-   Full project file.
-   Re-openable analysis.

A downloadable project format could look conceptually like:

``` text
project.json
dataset metadata
preprocessing pipeline
analysis configuration
cluster results
visualization settings
```

Do not store raw data in the project unless explicitly intended.

------------------------------------------------------------------------

# 52. State Management

Keep global state minimal.

Use state for:

-   Current project.
-   Current dataset.
-   Selected features.
-   Preprocessing state.
-   Analysis state.
-   Selected clustering solution.
-   UI preferences.

Do not put every component's local state into global state.

Rule:

> If only one component needs the state, keep it local.

------------------------------------------------------------------------

# 53. Caching

Cache:

-   Dataset profile.
-   Preprocessing result.
-   PCA projection.
-   Clustering results.
-   Metrics.

If the user changes only visualization settings, do not recompute
clustering.

If the user changes only cluster colors, do not recompute PCA.

If the user changes the preprocessing pipeline, invalidate downstream
results.

Think of the application as a dependency graph.

``` text
Raw Data
   ↓
Profile
   ↓
Preprocessing
   ↓
Feature Matrix
   ↓
Clustering
   ↓
Metrics / Profiles
   ↓
Visualization / STP
```

------------------------------------------------------------------------

# 54. V1 Development Phases

## Phase 0 --- Product skeleton

Build:

-   Vite.
-   React.
-   TypeScript.
-   Routing.
-   Design tokens.
-   Layout.
-   Empty workflow screens.
-   State architecture.

Goal:

> The entire application can be navigated even before analytics exist.

------------------------------------------------------------------------

## Phase 1 --- Data ingestion

Build:

-   CSV.
-   XLSX if practical.
-   Dataset preview.
-   Validation.
-   Dataset state.

Acceptance criteria:

> User can upload a realistic marketing dataset and inspect it
> immediately.

------------------------------------------------------------------------

## Phase 2 --- Profiling

Build:

-   Variable detection.
-   Missing values.
-   Unique counts.
-   Basic distributions.
-   Identifier detection.
-   Duplicate detection.
-   Outlier flags.

Acceptance criteria:

> User understands what is wrong/right with the dataset before
> clustering.

------------------------------------------------------------------------

## Phase 3 --- Preparation

Build:

-   Feature selection.
-   Scaling.
-   Missing-value handling.
-   Categorical encoding.
-   Transformation pipeline.
-   Recommendations.

Acceptance criteria:

> User can see and approve preprocessing decisions.

------------------------------------------------------------------------

## Phase 4 --- Core clustering

Build:

-   K-Means.
-   Hierarchical.
-   DBSCAN.
-   Metrics.
-   Cluster count exploration.

Acceptance criteria:

> User can run a meaningful clustering analysis without manually
> configuring everything.

------------------------------------------------------------------------

## Phase 5 --- Comparison

Build:

-   Candidate solutions.
-   Method comparison.
-   Metric comparison.
-   Cluster size comparison.
-   Recommended solution.

Acceptance criteria:

> User can understand why one solution may be preferable to another.

------------------------------------------------------------------------

## Phase 6 --- Visualization

Build:

-   PCA.
-   Interactive scatter.
-   Cluster selection.
-   Hover.
-   Zoom.
-   Filtering.
-   Dendrogram.

Acceptance criteria:

> User can visually explore the resulting segmentation.

------------------------------------------------------------------------

## Phase 7 --- Cluster interpretation

Build:

-   Cluster profiles.
-   Differentiating variables.
-   Cluster sizes.
-   Record-level inspection.
-   Explanation panels.

Acceptance criteria:

> Student can explain what each segment represents.

------------------------------------------------------------------------

## Phase 8 --- STP

Build:

-   Segmentation summary.
-   Targeting comparison.
-   Transparent weighted scoring.
-   Basic positioning map.
-   Editable conclusions.

Acceptance criteria:

> Student can connect clustering results to an STP analysis.

------------------------------------------------------------------------

## Phase 9 --- Export

Build:

-   Clustered CSV.
-   Report.
-   Basic PDF.

Acceptance criteria:

> Student can take the result outside the application.

------------------------------------------------------------------------

# 55. V1 Definition of Done

V1 is complete when a student can:

1.  Upload a marketing dataset.
2.  Understand its structure.
3.  Identify problematic variables.
4.  Select clustering features.
5.  Apply recommended preprocessing.
6.  Run a recommended clustering workflow.
7.  Compare clustering solutions.
8.  Understand validation metrics.
9.  Inspect clusters visually.
10. Profile each segment.
11. Understand what differentiates segments.
12. Compare segment attractiveness.
13. Create a basic positioning view where applicable.
14. Form a defensible STP conclusion.
15. Export the result.

If any of these require a developer to manually intervene, V1 is not
finished.

------------------------------------------------------------------------

# 56. V2 Roadmap

## V2A --- Better analytics

-   K-Medoids.
-   Spectral clustering.
-   More robust mixed-data methods.
-   UMAP.
-   t-SNE.
-   MDS.
-   Cluster stability.
-   Bootstrapping.
-   Sensitivity analysis.

------------------------------------------------------------------------

## V2B --- Education

-   Guided lessons.
-   Algorithm tutorials.
-   Interactive K-Means centroid animation.
-   "Try it yourself" exercises.
-   Quizzes.
-   Mistake detection.
-   Method-selection exercises.
-   Explainability glossary.

------------------------------------------------------------------------

## V2C --- Faculty

-   Instructor mode.
-   Create assignment.
-   Upload dataset.
-   Define objectives.
-   Set allowed methods.
-   Hide automatic recommendations if desired.
-   Student submissions.
-   Rubrics.
-   Compare submissions.
-   Faculty feedback.

------------------------------------------------------------------------

## V2D --- Projects

-   Save project.
-   Reopen project.
-   Version analyses.
-   Compare analyses.
-   Export project package.

------------------------------------------------------------------------

## V2E --- AI Tutor

Allow natural-language questions such as:

> Why did K-Means create these four clusters?

> Why does standardization matter here?

> Why is DBSCAN producing noise?

> What variables distinguish Segment 3?

> What are the limitations of this segmentation?

AI should answer from the actual analysis state.

------------------------------------------------------------------------

# 57. V3 Possibilities

Only after the core product is proven:

-   Collaborative classroom.
-   Cloud workspaces.
-   Large datasets.
-   Advanced survey analysis.
-   Text clustering.
-   Embeddings.
-   Consumer-review clustering.
-   Multi-dataset analysis.
-   Advanced positioning analysis.
-   Scenario simulation.
-   Marketing strategy recommendations.
-   LMS integration.
-   Institutional analytics.

V3 should be driven by actual usage rather than assumptions.

------------------------------------------------------------------------

# 58. Testing Strategy

Testing should exist from the beginning.

## Unit tests

Test:

-   Variable detection.
-   Missing-value calculations.
-   Scaling.
-   Encoding.
-   Distance calculations.
-   Cluster metrics.
-   Cluster profiles.
-   Recommendation rules.

## Integration tests

Test:

``` text
Upload
→ Profile
→ Prepare
→ Cluster
→ Profile clusters
→ Export
```

## Visual tests

Check:

-   Empty states.
-   Small datasets.
-   Large datasets.
-   Long column names.
-   Many clusters.
-   Missing values.
-   Errors.
-   Mobile/tablet layouts.

------------------------------------------------------------------------

# 59. Analytical Correctness

This project cannot be treated like a normal dashboard.

The analytical results must be validated against trusted
implementations.

For algorithms/metrics, create fixtures where:

> Our result ≈ trusted reference implementation.

Pay attention to:

-   Random seeds.
-   Initialization.
-   Scaling.
-   Missing values.
-   Distance definitions.
-   Tie handling.
-   DBSCAN parameters.
-   Categorical encoding.

Every algorithm should have a documented definition of what the
implementation actually does.

------------------------------------------------------------------------

# 60. Reproducibility

Every analysis should record:

-   Algorithm.
-   Parameters.
-   Distance metric.
-   Random seed.
-   Selected variables.
-   Data transformations.
-   Missing-value strategy.
-   Encoding strategy.
-   Scaling method.
-   Algorithm version.

This makes exported results defensible.

------------------------------------------------------------------------

# 61. Important Academic Guardrails

The tool should repeatedly reinforce several concepts without becoming
annoying.

### Clustering is exploratory.

There is rarely one universally correct solution.

### A high metric does not automatically mean a useful marketing segment.

Statistical quality and business usefulness are related but different.

### Visualization is not proof.

A 2D projection can distort high-dimensional structure.

### Preprocessing affects results.

Changing scaling or variable selection can materially change clusters.

### Correlation can distort interpretation.

Highly correlated variables can effectively receive disproportionate
influence.

### Cluster labels are arbitrary.

"Cluster 1" has no inherent meaning.

### Interpretation requires domain knowledge.

The tool can assist but should not manufacture certainty.

------------------------------------------------------------------------

# 62. What the Product Should Never Say

Avoid absolute statements like:

> "These are the correct customer segments."

Use:

> "This solution produces four distinct groups."

Avoid:

> "Segment 3 is your best target."

Use:

> "Segment 3 scores highest under the targeting criteria and weights you
> selected."

Avoid:

> "PCA proves these groups exist."

Use:

> "The PCA projection provides a 2D view of the clustering space."

This distinction matters in an academic environment.

------------------------------------------------------------------------

# 63. UX Rules

## Rule 1

One primary action per screen.

## Rule 2

Do not ask for technical configuration unless necessary.

## Rule 3

Every recommendation should have a "Why?"

## Rule 4

Every advanced control should be optional.

## Rule 5

Never hide a transformation that materially changes the data.

## Rule 6

Never make the user interpret a metric without providing a short
explanation.

## Rule 7

Keep technical detail one click away.

## Rule 8

Never show a huge table when a concise summary will do.

## Rule 9

Always preserve the user's place in the workflow.

## Rule 10

Never recompute expensive analysis unnecessarily.

------------------------------------------------------------------------

# 64. Component Design Rules

Build reusable primitives:

-   Button.
-   IconButton.
-   Badge.
-   Tooltip.
-   Card.
-   DataTable.
-   MetricCard.
-   StepIndicator.
-   EmptyState.
-   LoadingState.
-   ErrorState.
-   Drawer.
-   Modal.
-   Tabs.
-   Select.
-   Slider.
-   Toggle.
-   ChartContainer.
-   ExplanationPanel.

But keep domain components inside their features.

Example:

``` text
components/ui/MetricCard.tsx
```

versus:

``` text
features/clustering/components/ClusterMetricSummary.tsx
```

The first is generic.

The second knows about clustering.

------------------------------------------------------------------------

# 65. Do Not Over-Abstract Early

Avoid building an elaborate design system before the product exists.

First establish:

-   Typography.
-   Colors.
-   Spacing.
-   Buttons.
-   Cards.
-   Inputs.
-   Tables.
-   Charts.

Then extract patterns that genuinely repeat.

Premature abstraction will slow development.

------------------------------------------------------------------------

# 66. Recommended Folder Ownership Rule

A feature owns its:

-   Components.
-   Hooks.
-   Types.
-   Services.
-   Validation.
-   Domain logic.

Shared code goes into:

``` text
components/
lib/
types/
```

only when it is genuinely shared.

This prevents a huge global utility folder.

------------------------------------------------------------------------

# 67. Dependency Rules

Prefer:

``` text
features → lib
features → shared components
features → domain types
```

Avoid:

``` text
feature A → feature B → feature C → feature A
```

Circular feature dependencies will make V2 painful.

If two features share logic, move that logic into an appropriate
domain/service layer.

------------------------------------------------------------------------

# 68. Git / Development Strategy

Use small feature branches or commits.

Recommended progression:

``` text
feat/app-shell
feat/file-upload
feat/data-profiling
feat/preprocessing
feat/kmeans
feat/hierarchical
feat/dbscan
feat/cluster-comparison
feat/pca-visualization
feat/cluster-profiling
feat/stp
feat/export
```

Each feature should be independently testable.

Do not build the entire frontend first and analytics afterward.

------------------------------------------------------------------------

# 69. Development Order: The Correct Priority

The temptation will be to build the beautiful visualization first.

Don't.

Priority should be:

``` text
1. Analytical correctness
2. Data pipeline
3. User workflow
4. Performance
5. Explanation
6. Visual polish
7. Advanced features
```

A beautiful incorrect clustering tool is useless.

------------------------------------------------------------------------

# 70. Recommended V1 Screen Map

``` text
START
 │
 ├── Upload Dataset
 │
 ▼
DATA
 │
 ├── Overview
 ├── Variables
 └── Data Quality
 │
 ▼
PREPARE
 │
 ├── Feature Selection
 ├── Missing Values
 ├── Scaling
 └── Recommendations
 │
 ▼
CLUSTER
 │
 ├── Recommended Analysis
 ├── Compare Methods
 ├── Choose Algorithm
 ├── Choose K
 └── Advanced Settings
 │
 ▼
UNDERSTAND
 │
 ├── Overview
 ├── Visualization
 ├── Cluster Profiles
 ├── Differences
 └── Records
 │
 ▼
STP
 │
 ├── Segmentation
 ├── Targeting
 └── Positioning
 │
 ▼
REPORT
 │
 ├── Review
 └── Export
```

------------------------------------------------------------------------

# 71. Ideal V1 Main Navigation

Left sidebar:

``` text
DATA
  Overview
  Variables

PREPARE
  Features
  Transform

CLUSTER
  Analysis
  Compare

UNDERSTAND
  Segments
  Visualization

STP
  Targeting
  Positioning

REPORT
```

The current step should be visually obvious.

------------------------------------------------------------------------

# 72. Home/Project State

For the initial implementation, don't build accounts/authentication
unless required.

Start with:

> **New Analysis**

and:

> **Sample Dataset**

Later add project persistence.

This keeps the initial product focused.

------------------------------------------------------------------------

# 73. Sample Datasets

V1 should ship with several carefully constructed sample datasets.

Examples:

### Customer segmentation

-   Age.
-   Income.
-   Spend.
-   Frequency.
-   Loyalty.

### Brand perception

-   Quality.
-   Price.
-   Innovation.
-   Trust.
-   Convenience.

### Student segmentation

-   Study hours.
-   Attendance.
-   Performance.
-   Activities.
-   Engagement.

### Mixed survey dataset

-   Numerical.
-   Categorical.
-   Likert/ordinal.

These datasets should be intentionally designed to demonstrate different
clustering situations.

------------------------------------------------------------------------

# 74. Sample Dataset Experience

The user should be able to click:

**Try with sample data**

without uploading anything.

This is critical for classroom demonstrations.

Faculty should be able to open the product and immediately demonstrate
clustering.

------------------------------------------------------------------------

# 75. Faculty Demonstration Mode

Even if full instructor functionality is V2, make V1 demo-friendly.

A professor should be able to:

1.  Open sample dataset.
2.  Run analysis.
3.  Change K.
4.  Show cluster movement/results.
5.  Explain metrics.
6.  Compare methods.
7.  Show segment profiles.

No account should be necessary for this if the deployment allows it.

------------------------------------------------------------------------

# 76. Performance Targets

Set explicit goals.

For a normal classroom dataset:

-   App initial shell: fast.
-   File upload feedback: immediate.
-   Profiling: ideally \<2 seconds for moderate datasets.
-   UI interactions: \<100ms where possible.
-   Panel transitions: 150--250ms.
-   Visualization interaction: smooth.
-   Expensive analysis: show progress rather than freezing.

Do not promise a fixed clustering runtime because dataset size and
algorithm complexity vary.

------------------------------------------------------------------------

# 77. Large Dataset Strategy

The application should detect dataset size.

Example:

``` text
< 10,000 rows
→ client-side recommended

10,000–100,000
→ warn / optimize / worker

> 100,000
→ backend or advanced processing recommended
```

Exact thresholds should be benchmarked rather than treated as universal.

------------------------------------------------------------------------

# 78. Responsive Design

Primary target:

**Desktop/laptop**

because this is analytical software.

Still support:

-   Tablet.
-   Smaller screens.

Do not attempt to force the complete analytical workspace onto a phone.

On small screens:

-   Collapse sidebar.
-   Stack cards.
-   Allow horizontal chart scrolling.
-   Preserve usability rather than preserving desktop layout exactly.

------------------------------------------------------------------------

# 79. Accessibility

Minimum:

-   Keyboard navigation.
-   Visible focus states.
-   Accessible labels.
-   Sufficient contrast.
-   Do not encode cluster identity through color alone.
-   Tooltips should not contain essential information exclusively.
-   Screen-reader labels for charts where feasible.

For clusters, combine:

> color + number/name + selectable legend.

------------------------------------------------------------------------

# 80. Naming the Product Internally

Until branding is decided, use a neutral internal name:

**ClusterLab**

or

**STP Lab**

The product name should not determine the architecture.

------------------------------------------------------------------------

# 81. Suggested V1 Technical Architecture

``` text
                         React + Vite
                              │
                     ┌────────┴────────┐
                     │                 │
                 UI Layer         Application State
                     │                 │
                     └────────┬────────┘
                              │
                       Feature Services
                              │
              ┌───────────────┼────────────────┐
              │               │                │
          Data Layer    Analysis Layer    Export Layer
              │               │
              │         ┌─────┴──────┐
              │         │            │
         Profiling   Preprocessing  Clustering
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                 K-Means      Hierarchical    DBSCAN
                    │             │             │
                    └─────────────┼─────────────┘
                                  │
                              Metrics
                                  │
                             Profiles
                                  │
                           Visualization
                                  │
                                STP
```

------------------------------------------------------------------------

# 82. If a Backend Is Added

Keep the API boundary clean.

Conceptually:

``` text
POST /datasets/profile
POST /analysis/preprocess
POST /analysis/cluster
POST /analysis/compare
POST /analysis/report
```

But do not build the backend merely because "real applications need a
backend."

Use one when there is a concrete need:

-   Large datasets.
-   Persistence.
-   AI.
-   Instructor workflows.
-   Secure project storage.

------------------------------------------------------------------------

# 83. API Contract Principle

Never return presentation-specific data from the analytical service.

Bad:

``` json
{
  "chartColor": "#4F46E5",
  "cardTitle": "Best Cluster"
}
```

Good:

``` json
{
  "clusterId": 2,
  "size": 742,
  "sizeShare": 0.31,
  "metrics": {...},
  "profile": {...},
  "differentiators": [...]
}
```

The UI decides how to present it.

This keeps the backend reusable.

------------------------------------------------------------------------

# 84. Analytics Result Contract

A cluster result should contain enough information to reconstruct the
UI.

Conceptually:

``` text
ClusterAnalysisResult
├── algorithm
├── parameters
├── featureSet
├── preprocessing
├── labels
├── metrics
├── clusterSizes
├── centroids/profile
├── differentiators
├── projection
└── warnings
```

------------------------------------------------------------------------

# 85. Warnings System

Create a structured warning system.

Examples:

``` text
WARNING:
Selected features have very different scales.

WARNING:
Cluster 4 contains only 3.2% of observations.

WARNING:
DBSCAN classified 14% of observations as noise.

WARNING:
Two selected variables are highly correlated.

INFO:
PCA projection explains 61% of variance in two dimensions.
```

Warnings should be actionable.

------------------------------------------------------------------------

# 86. The Recommendation Engine

Do not initially use ML to recommend clustering algorithms.

Use transparent rules.

Example:

``` text
IF mostly_numeric
AND scaled
AND moderate_outliers
THEN recommend K-Means

IF mixed_types
THEN recommend Gower-compatible workflow

IF high_outlier_fraction
THEN consider DBSCAN

IF dataset_size is small/moderate
THEN show hierarchical option
```

Later, empirical benchmarks can improve these rules.

------------------------------------------------------------------------

# 87. The "Recommended" Badge

Use the word **Recommended**, not **Best**.

Good:

> Recommended approach

Bad:

> Best algorithm

Because the latter implies a level of certainty the system cannot
guarantee.

------------------------------------------------------------------------

# 88. Cluster Naming

Do not automatically assign flashy marketing labels without evidence.

Instead generate a descriptive draft:

> Cluster 2 --- High spend / high loyalty

Allow editing:

> "Loyal premium customers"

The student should own the interpretation.

------------------------------------------------------------------------

# 89. AI Cluster Naming

If AI is used, clearly distinguish:

> **AI-generated description**

from:

> **Statistical profile**

Never blur them.

------------------------------------------------------------------------

# 90. Marketing Insight Guardrail

The system can say:

> This segment has higher average spend.

It should not automatically claim:

> This segment will be more profitable.

unless profitability data actually exists.

Likewise:

> High price sensitivity

does not automatically mean:

> Will respond to discounts.

That is a hypothesis, not a measured result.

Use:

> **Potential implication**

rather than:

> **Guaranteed response**

------------------------------------------------------------------------

# 91. What Success Looks Like

A successful V1 should make a student say:

> "I uploaded my data and I understand what I am supposed to do."

Then:

> "I understand why the tool recommended this method."

Then:

> "I can see why these people belong to this segment."

Then:

> "I can explain what the segment means in marketing terms."

And finally:

> "I can defend my STP decision."

That is the product's real success metric.

------------------------------------------------------------------------

# 92. Final V1 Feature Checklist

## Data

-   [ ] CSV upload
-   [ ] XLSX upload
-   [ ] Dataset preview
-   [ ] Variable detection
-   [ ] Identifier detection
-   [ ] Missing values
-   [ ] Duplicate detection
-   [ ] Basic outlier detection

## Preparation

-   [ ] Feature selection
-   [ ] Scaling
-   [ ] Missing-value handling
-   [ ] Categorical encoding
-   [ ] Recommendation system
-   [ ] Reproducible pipeline

## Clustering

-   [ ] K-Means
-   [ ] Hierarchical
-   [ ] DBSCAN
-   [ ] GMM if stable
-   [ ] Cluster count exploration
-   [ ] Distance metrics
-   [ ] Method comparison

## Evaluation

-   [ ] Silhouette
-   [ ] Davies-Bouldin
-   [ ] Calinski-Harabasz
-   [ ] Cluster sizes
-   [ ] Warnings
-   [ ] Recommendation

## Visualization

-   [ ] PCA
-   [ ] Interactive scatter
-   [ ] Dendrogram
-   [ ] Hover
-   [ ] Select cluster
-   [ ] Filter
-   [ ] Zoom
-   [ ] Cluster legend

## Interpretation

-   [ ] Cluster profile
-   [ ] Differentiating variables
-   [ ] Record-level view
-   [ ] Explain cluster
-   [ ] Technical details

## STP

-   [ ] Segmentation
-   [ ] Segment comparison
-   [ ] Targeting framework
-   [ ] Transparent weighted scoring
-   [ ] Basic positioning map
-   [ ] Editable interpretation

## Export

-   [ ] Clustered CSV
-   [ ] Analysis report
-   [ ] PDF

## UX

-   [ ] Guided mode
-   [ ] Advanced mode
-   [ ] Progressive disclosure
-   [ ] Loading states
-   [ ] Error states
-   [ ] Smooth animation
-   [ ] Responsive desktop/tablet UI
-   [ ] Accessibility basics

------------------------------------------------------------------------

# 93. Final V2 Checklist

-   [ ] UMAP
-   [ ] t-SNE
-   [ ] MDS
-   [ ] K-Medoids
-   [ ] Spectral clustering
-   [ ] Stability analysis
-   [ ] Sensitivity analysis
-   [ ] Text clustering
-   [ ] Embeddings
-   [ ] AI tutor
-   [ ] Saved projects
-   [ ] Project versioning
-   [ ] Assignment mode
-   [ ] Instructor mode
-   [ ] Submission/review
-   [ ] PPT export
-   [ ] Advanced STP analysis
-   [ ] LMS integration

------------------------------------------------------------------------

# 94. The Most Important Product Rule

Do not build this as:

> **"A machine-learning dashboard with a marketing tab."**

Build it as:

> **"A learning environment for turning data into defensible
> segmentation and STP decisions, powered by rigorous clustering
> analytics."**

The clustering algorithms are the engine.

The **student's analytical journey is the product.**

------------------------------------------------------------------------

# 95. Recommended Immediate Next Steps

Do not start coding all features immediately.

Follow this sequence:

### Step 1

Freeze the V1 scope.

### Step 2

Create the information architecture.

### Step 3

Create low-fidelity wireframes for:

-   Upload.
-   Dataset overview.
-   Prepare.
-   Cluster.
-   Compare.
-   Understand.
-   STP.
-   Report.

### Step 4

Create the visual design system.

### Step 5

Create the Vite/React project skeleton.

### Step 6

Build the complete navigation/workflow using sample/mock data.

### Step 7

Implement the data pipeline.

### Step 8

Implement K-Means first.

### Step 9

Implement metrics.

### Step 10

Implement hierarchical and DBSCAN.

### Step 11

Connect the real analytical results to the UI.

### Step 12

Build the interactive visualization.

### Step 13

Build cluster profiling.

### Step 14

Build STP.

### Step 15

Build exports.

### Step 16

Benchmark performance.

### Step 17

Test analytical correctness against reference implementations.

### Step 18

Run the entire workflow using realistic IIMB-style marketing datasets.

### Step 19

Polish animations and micro-interactions.

### Step 20

Only then consider additional features.

------------------------------------------------------------------------

# 96. One-Sentence Product Definition

> **A fast, guided and interactive clustering workspace that helps
> marketing students move from raw data to understandable customer
> segments and defensible STP decisions, while exposing deeper
> statistical and mathematical detail when they need to learn it.**

This should be the north star for the project.
