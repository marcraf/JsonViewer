# Tasks: JSON Tree Visualizer

**Input**: Design documents from `/specs/001-json-tree-visualizer/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Structure**: Web application structure with code in `frontend/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project folders structure under `frontend/src/features/json-visualizer/`
- [x] T002 [P] Create type definitions in `frontend/src/features/json-visualizer/types/index.ts`
- [x] T003 [P] Create base parser utility functions in `frontend/src/features/json-visualizer/utils/jsonHelpers.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic and state management block that must be complete before any user story UI can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create the hook `frontend/src/features/json-visualizer/hooks/useJsonVisualizer.ts` for managing editor/tree state and JSON parsing
- [x] T005 [P] Create parser helper unit tests in `frontend/src/features/json-visualizer/tests/json-helpers.spec.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Formatação de JSON (Priority: P1) 🎯 MVP

**Goal**: Accept raw JSON, format it with 2 spaces and colors, catch parse errors without crash.

**Independent Test**: Cole JSON inválido, depois JSON desordenado, valide que botão formata e exibe erro amigável sem quebras.

### Tests for User Story 1
- [x] T006 [P] [US1] Create unit tests in `frontend/src/features/json-visualizer/tests/json-visualizer.spec.tsx` for formatting and error scenarios

### Implementation for User Story 1
- [x] T007 [US1] Implement input editor panel `frontend/src/features/json-visualizer/components/JsonInputArea.tsx` with textarea, buttons, and error alert
- [x] T008 [US1] Implement core wrapper component `frontend/src/features/json-visualizer/components/JsonVisualizer.tsx` displaying formatted output

**Checkpoint**: User Story 1 is functional (MVP)

---

## Phase 4: User Story 2 - Visualização em Árvore de Objetos (Priority: P2)

**Goal**: Render interactive tree view with recursive collapsible/expandable nodes and color mapping.

**Independent Test**: Acesse a aba árvore, verifique que setas expandem/recolhem nós filhos de forma lazy e cores identificam os tipos corretos.

### Tests for User Story 2
- [x] T009 [P] [US2] Add unit tests for tree component render and toggle behaviors in `frontend/src/features/json-visualizer/tests/json-visualizer.spec.tsx`

### Implementation for User Story 2
- [x] T010 [US2] Create recursive tree node component `frontend/src/features/json-visualizer/components/JsonTreeNode.tsx` rendering individual key-values
- [x] T011 [US2] Create tree container view `frontend/src/features/json-visualizer/components/JsonTreeView.tsx` with Expand/Collapse All controls
- [x] T012 [US2] Integrate tree view panel in `frontend/src/features/json-visualizer/components/JsonVisualizer.tsx` tabs

**Checkpoint**: User Story 2 is integrated and functional

---

## Phase 5: User Story 3 - Busca e Filtro de Nós na Árvore (Priority: P3)

**Goal**: Real-time debounce search of keys and values, auto-expanding parent nodes to matching targets.

**Independent Test**: Digite um termo no campo de busca, verifique destaque e expansão automática de nós pais.

### Tests for User Story 3
- [x] T013 [P] [US3] Add unit tests for search logic and auto-expansion in `frontend/src/features/json-visualizer/tests/json-visualizer.spec.tsx`

### Implementation for User Story 3
- [x] T014 [US3] Add search DFS algorithm and expansion path resolver in `frontend/src/features/json-visualizer/utils/jsonHelpers.ts`
- [x] T015 [US3] Update tree wrapper view `frontend/src/features/json-visualizer/components/JsonTreeView.tsx` with search input, debounce delay, and query highlights

---

## Phase 6: Integração no Shell (Rotas e Menu)

**Purpose**: Integrate the feature component as an admin dashboard utility page.

- [x] T016 Create page wrapper component `frontend/src/pages/admin/JsonVisualizerPage.tsx`
- [x] T017 Register route `/admin/json-visualizer` and link to navigation sidebar in shell routing files

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Performance optimizations, E2E validation, and accessibility compliance.

- [x] T018 [P] Create Playwright E2E tests in `tests/e2e/json-visualizer.spec.ts`
- [x] T019 Refactor node component using React `useTransition` to optimize rendering speed for inputs > 1MB
- [x] T020 Audit and enforce WCAG 2.1 AA accessibility (keyboard focus, node toggle aria labels) in components
- [x] T021 Execute validation scenarios from `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational completion. Runs in sequence P1 → P2 → P3.
- **Polish (Phase 7)**: Depends on all user stories and integration completed.

### Parallel Opportunities

- T002 and T003 can be built in parallel.
- Test tasks marked with `[P]` (T006, T009, T013, T018) can be written in parallel with code design.
