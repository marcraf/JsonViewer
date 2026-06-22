<!--
[Sync Impact Report]
- Version change: 1.4.0 -> 1.5.0
- List of modified principles:
  - Adicionado: VII. Shell de Layout Unificado para Rotas Autenticadas (cabeçalho fixo, barra lateral responsiva/drawer, restrição a rotas não autenticadas)
- Added sections:
  - Nenhuma
- Removed sections:
  - Nenhuma
- Templates requiring updates:
  - Nenhuma atualização necessária nos templates (totalmente compatíveis)
- Follow-up TODOs:
  - Nenhuma pendência ou placeholder diferido.
-->

# Constituição do Enterprise B2B SaaS

## Princípios Fundamentais

### I. Separação Arquitetural (Feature-Driven / Screaming Architecture) e DDD em Monorepo
O projeto DEVE ser estruturado em um monorepo com separação estrita de responsabilidades entre frontend e backend. A arquitetura de pastas interna DEVE seguir o padrão Feature-Driven Architecture (ou Screaming Architecture), onde os arquivos são agrupados por domínio/funcionalidade corporativa (ex: `authentication`, `billing`) em vez de tipo técnico. Cada pasta de funcionalidade em `src/features/[funcionalidade]/` deve encapsular seus próprios componentes (React), hooks, controladores (Node.js), regras de negócio/serviços e testes correspondentes. As entidades globais e a lógica de negócios central DEVEM seguir princípios de Clean Architecture e DDD, permanecendo isoladas de infraestrutura. A comunicação entre frontend e backend DEVE se dar por contratos de API fortemente tipados.
*Motivação: Facilita a localização de código, isola o impacto de alterações em funcionalidades específicas, simplifica testes unitários/integração e reflete a estrutura do negócio diretamente na árvore de arquivos do projeto.*

### II. Isolamento Multi-tenant e Segurança RBAC/ABAC
O isolamento de dados de múltiplos inquilinos (multi-tenancy) DEVE ser implementado no nível mais profundo da arquitetura do banco de dados (seja por esquemas separados ou chaves de inquilino estritamente validadas em nível de consulta). Toda requisição ao backend DEVE verificar o ID do tenant. Além disso, o controle de acesso DEVE ser governado por políticas híbridas de Controle de Acesso Baseado em Papéis (RBAC) e Controle de Acesso Baseado em Atributos (ABAC), garantindo que usuários possuam apenas os privilégios estritamente necessários para os recursos do tenant correspondente.
*Motivação: A segurança e o isolamento de dados são requisitos não-negociáveis para sistemas B2B corporativos, onde vazamentos de dados entre inquilinos ou acessos não autorizados podem gerar sérias implicações legais.*

### III. Qualidade de Código, Alinhamento Tecnológico e Dependências
Todo o código escrito no projeto DEVE usar TypeScript no modo estrito (`strict: true`), proibindo o uso de tipos implícitos ou explícitos `any` sem justificativa excepcional documentada. As regras de formatação e estilo DEVEM ser impostas automaticamente via ferramentas de análise estática (ESLint) e formatador de código (Prettier) pré-configurados no monorepo. O ecossistema do projeto DEVE se manter alinhado às versões LTS estáveis do Node.js e versões principais do React (especificamente React 19+). É PROIBIDA a instalação de bibliotecas de terceiros que não possuam suporte nativo a ESM (ECMAScript Modules) ou que causem conflitos de tipagem estrita no TypeScript.
*Motivação: Reduz a ocorrência de erros em execução, padroniza o estilo, evita débitos técnicos decorrentes de bibliotecas obsoletas ou sem suporte a ESM e assegura a modernidade tecnológica do produto.*

### IV. Pirâmide de Testes e Cobertura Mínima
Toda funcionalidade implementada DEVE possuir testes automatizados adequados. O backend DEVE usar Jest para testes unitários e de integração de serviços/APIs. O frontend DEVE usar Vitest e React Testing Library para componentes e hooks, com um limite mínimo obrigatório de **80% de cobertura de código**. Fluxos críticos de ponta a ponta (E2E), incluindo autenticação, checkout e fluxos principais do usuário, DEVEM ser testados usando Playwright.
*Motivação: A confiança na estabilidade da aplicação é mantida por meio de testes automatizados rápidos, reduzindo regressões e garantindo que o sistema funcione corretamente sob o ponto de vista do usuário final.*

### V. Consistência de UX Enterprise, Responsividade e Acessibilidade (WCAG)
A interface de usuário DEVE ser construída de forma modular a partir de um Design System consistente e escalável. Todos os componentes criados DEVEM seguir os padrões estabelecidos na biblioteca de componentes visuais do projeto, evitando estilos ad-hoc. A aplicação frontend DEVE ser responsiva por padrão, adotando a abordagem Mobile-First ou adaptativa baseada em breakpoints estruturados para suportar perfeitamente dispositivos móveis, tablets e resoluções desktop comuns em ambientes corporativos. Adicionalmente, toda a interface DEVE cumprir as diretrizes de acessibilidade WCAG 2.1 nível AA, garantindo suporte completo a navegação por teclado, leitores de tela e contraste de cores adequado.
*Motivação: A uniformidade visual reforça a credibilidade do produto com clientes corporativos, a responsividade garante flexibilidade operacional em qualquer tela, e a conformidade com padrões de acessibilidade é mandatória por lei em muitos âmbitos.*

### VI. Alta Performance e Escalabilidade
O software DEVE ser otimizado para lidar com cargas corporativas de maneira eficiente. O backend Node.js DEVE gerenciar operações assíncronas em larga escala com cautela, evitando bloqueios do event loop. É PROIBIDO o uso de `Promise.all` para arrays dinâmicos de tamanho desconhecido. Em vez disso, deve-se adotar o `Promise.allSettled` combinando controle de concorrência ou descarregar tarefas pesadas da thread principal utilizando `setImmediate()` ou Workers. A conexão com o banco de dados DEVE usar connection pooling configurado adequadamente para o tráfego estimado. O frontend React DEVE ser projetado com capacidades de lazy-loading e divisão de código (code splitting), preparando a arquitetura para suportar abordagens de micro-frontends se a escala do projeto exigir.
*Motivação: Garante tempos de resposta rápidos, impede travamentos e vazamentos de memória no backend causados por concorrência não controlada e otimiza o uso de recursos de infraestrutura à medida que a base de clientes cresce.*

### VII. Shell de Layout Unificado para Rotas Autenticadas
A aplicação frontend DEVE implementar um shell de layout fixo composto por um cabeçalho fixo no topo (para branding, ações globais e menu de usuário) e uma barra lateral esquerda persistente para navegação primária. Este layout DEVE ser imposto como o componente de layout raiz que envolve todas as rotas autenticadas. Rotas não autenticadas (como login e onboarding) estão isentas e PODEM utilizar um layout centralizado de largura total. A barra lateral DEVE suportar estados recolhido/expandido (collapsed/expanded) e ser responsiva (comportamento de drawer overlay em dispositivos móveis). Nenhuma página autenticada DEVE renderizar fora deste shell sem justificativa arquitetural explícita.
*Motivação: Garante consistência visual, facilita a navegação contínua do usuário pelo ecossistema SaaS corporativo e otimiza o aproveitamento do espaço de tela em diferentes viewports.*

## Diretrizes de Segurança e Infraestrutura B2B

Para manter a segurança e a integridade de dados do ambiente B2B, as seguintes regras técnicas DEVEM ser aplicadas:
1. **Configurações e Segredos**: Credenciais, segredos de API e variáveis de ambiente nunca DEVEM ser inclusos no código-fonte ou no controle de versão. Eles DEVEM ser injetados de forma segura durante o build ou em tempo de execução usando gerenciadores de segredos apropriados.
2. **Criptografia**: Todos os dados em trânsito DEVEM utilizar TLS 1.3 ou superior. Dados confidenciais em repouso (dados pessoais e tokens de autenticação) DEVEM ser criptografados.
3. **Validação de Entradas**: Todas as requisições de API no backend DEVEM passar por validação de formato e de tipo rigorosas no nível do middleware (usando bibliotecas como Zod) antes de atingir as camadas de domínio.

## Workflow de Desenvolvimento e Portões de Qualidade (Quality Gates)

O desenvolvimento no repositório segue um pipeline rigoroso de controle de qualidade:
1. **Branching e Commits**: Novas funcionalidades DEVEM ser desenvolvidas em ramificações específicas baseadas no padrão `feature/[id]-nome-da-funcionalidade`. Commits DEVEM seguir a convenção de Commits Semânticos (Conventional Commits).
2. **Integração Contínua (CI)**: O pipeline de CI DEVE executar automaticamente a validação de tipos do TypeScript, linting de código, testes unitários, testes de integração, auditoria de segurança de dependências (`npm audit`) e verificação de cobertura (mínimo de 80%) para qualquer Pull Request enviado.
3. **Revisões de Código**: Nenhuma alteração pode ser integrada à branch principal (`main`) sem a aprovação de pelo menos um engenheiro sênior após uma revisão detalhada que valide a conformidade com esta Constituição.

## Governança

Esta Constituição é o documento de governança supremo deste repositório e sobressai a quaisquer práticas informais de desenvolvimento. Alterações neste documento DEVEM seguir o seguinte processo:
1. Proposta formal de alteração detalhando a motivação e os impactos em termos de versionamento.
2. Discussão aberta com os membros do comitê técnico/desenvolvimento.
3. Aprovação formal do comitê.
4. Incremento da versão da Constituição de acordo com as regras de Versionamento Semântico e atualização dos templates afetados se houver.

**Versão**: 1.5.0 | **Ratificado**: 2026-06-19 | **Última Alteração**: 2026-06-22
