# VendingFlow — Hack Brasil 2026

Protótipo de automação de uma vending machine para a trilha **Logística & automação**. O problema é a falta de visibilidade entre venda, comando para a máquina, confirmação de liberação e atualização de estoque. Quando esses estados ficam desconectados, pedidos pagos podem se perder ou o estoque pode divergir.

O autor já construiu uma máquina física com peças impressas em 3D usando seu kit Arduino, em funcionamento em lavanderias. Segundo o autor, a produção completa dessa máquina custou cerca de **R$ 1.000**, incluindo os componentes. Ele considera esse custo baixo em comparação com máquinas comerciais atuais; os preços de mercado variam conforme modelo e capacidade. Essa experiência real motivou o protótipo de software apresentado aqui. **A demo web simula a máquina e não está conectada ao equipamento em operação.**

O VendingFlow reúne esse fluxo em uma demonstração interativa. O cliente escolhe um dos quatro produtos, confirma uma compra **simulada** e acompanha o comando. O operador pode desconectar a máquina para ver a fila de comandos e reconectá-la para retomar o processamento. O estoque só baixa depois do ACK simulado do motor. Um painel mostra vendas, fila, estado da máquina e eventos recentes.

## Como testar

1. Abra `index.html` em um navegador moderno, ou acesse a página pública da demo.
2. Clique em **Comprar na demo** e confirme a compra simulada.
3. Veja os eventos no painel de operação e a atualização do estoque.
4. Clique em **Simular desconexão**, faça outra compra e observe o comando pendente.
5. Clique em **Reconectar máquina** para processar a fila.
6. Use **Repor estoque** ou **Reiniciar demo** para repetir os cenários.

Não há dependências, backend, conta ou pagamento real. O estado da demo é salvo no `localStorage` do navegador. Para servir via HTTP, execute `python -m http.server 8000` e acesse `http://localhost:8000`.

## Arquitetura e evolução

- `index.html`: interface de compra e operação.
- `styles.css`: layout responsivo e visual da máquina.
- `app.js`: máquina de estados da demo, fila de comandos, ACK, estoque e registro de eventos.

Esta versão testa a experiência e o fluxo de estados sem hardware. Uma integração de produção exigiria webhook de pagamento autenticado, identificador idempotente por pedido, broker para comandos, confirmação assinada do dispositivo e persistência no servidor. **Nenhuma dessas integrações é apresentada como concluída nesta demo.**

## Origem e conformidade com o regulamento

A ideia partiu da experiência do autor com sua máquina física em lavanderias e do projeto público anterior, [maquina-vending-esp32](https://github.com/eduardowakim-lab/maquina-vending-esp32), criado antes do Hack Brasil. Este repositório é um protótipo novo de software, escrito durante o evento. Nenhum arquivo, código ou histórico de commits do projeto anterior foi importado. O projeto anterior permanece intacto e não é o repositório entregue à competição.

O código deste protótipo é disponibilizado sob a licença MIT (veja `LICENSE`). A demo é ilustrativa: não coleta dados pessoais e não processa pagamentos reais.

## Evidências para avaliação

| Exigência | Evidência nesta entrega |
| --- | --- |
| Trilha principal | Logística & automação: fila de comandos, confirmação de liberação e controle de estoque para operadores de máquinas autônomas. |
| Repositório criado durante o evento | Este repositório público foi criado após 4/11/2026 às 21h; seus commits começaram durante o Hack Brasil 2026. |
| Trabalho anterior | A máquina física e a ideia são anteriores. O software desta entrega é novo; o projeto anterior é citado acima, sem arquivos ou histórico importados. |
| Código acessível | HTML, CSS e JavaScript sem dependências, com instruções de teste acima e licença MIT. |
| Demo pública | https://eduardowakim-lab.github.io/vendingflow-hackbrasil-2026/ — funciona em HTTPS, sem conta, e usa dados e pagamentos simulados. |
| Vídeo obrigatório | [Demonstração guiada de 58 segundos](https://eduardowakim-lab.github.io/vendingflow-hackbrasil-2026/vendingflow-demo-hackbrasil.mp4), com capturas da demo pública: compra simulada, fila, ACK, estoque e reconexão. O arquivo também está neste repositório. |

O vídeo é uma sequência legendada de capturas reais da **demo web**; não é uma gravação da máquina física nem da integração entre software e hardware. Esta seção documenta fatos verificáveis e não substitui a conferência do regulamento pelos organizadores.
