# Guia do Painel Administrativo - Tembiu

Este guia explica como usar o Painel Administrativo do Tembiu para gerenciar seu cardápio digital, configurações do restaurante e pedidos.

## Acessando o Painel Administrativo

Para acessar o painel administrativo, navegue até o arquivo `admin.html` no seu navegador. Se você estiver rodando o Tembiu localmente a partir da raiz do projeto, o endereço geralmente será:

`http://localhost:<PORTA>/admin.html`

Substitua `<PORTA>` pela porta que seu servidor local está usando (ex: 3000, 8080).

**Importante:** Assim como o `index.html`, o `admin.html` requer que as credenciais do Turso (URL e Token de Autenticação) estejam corretamente configuradas no arquivo `js/admin.js`. Se não estiverem, as funcionalidades do painel que dependem do banco de dados não funcionarão.

## Navegação Principal

No topo do painel, você encontrará uma barra de navegação para alternar entre as diferentes seções:

*   **Gerenciar Cardápio**: Adicionar, editar, excluir e visualizar itens do cardápio.
*   **Configurações do Restaurante**: Modificar informações gerais do seu restaurante.
*   **Gerenciar Pedidos**: Visualizar pedidos recebidos e atualizar seus status.
*   **Relatórios**: (Em desenvolvimento) Visualizar estatísticas de vendas.

Clique em um link para ir para a seção correspondente.

## 1. Gerenciar Cardápio

Esta seção permite que você controle totalmente os itens exibidos no seu cardápio digital.

### Visualizando Itens do Cardápio

Ao entrar nesta seção, uma tabela exibirá todos os itens atualmente no seu cardápio, mostrando:
*   **Nome**: Nome do item.
*   **Categoria**: Categoria à qual o item pertence.
*   **Preço**: Preço do item.
*   **Disponível**: "Sim" se o item está marcado como disponível para venda, "Não" caso contrário.
*   **Ações**: Botões para "Editar" ou "Excluir" o item.

Você pode usar o campo de busca acima da tabela para filtrar os itens por nome ou categoria.

### Adicionando um Novo Item ao Cardápio

1.  Localize o formulário "Adicionar/Editar Item do Cardápio" no topo da seção.
2.  Preencha os campos:
    *   **Nome do Item**: O nome do prato ou produto (obrigatório).
    *   **Categoria**: A categoria do item (ex: Pizzas, Bebidas, Sobremesas) (obrigatório).
    *   **Preço (R$)**: O preço do item. Use ponto como separador decimal (ex: 25.90) (obrigatório).
    *   **Descrição**: Uma breve descrição do item (opcional).
    *   **Emoji (opcional)**: Um emoji para representar o item visualmente no cardápio.
    *   **Disponível**: Marque esta caixa se o item estiver disponível para venda. Desmarque para ocultá-lo temporariamente do cardápio público.
3.  Clique no botão **"Salvar Item"**.
4.  O item será adicionado ao banco de dados e a tabela será atualizada.

### Editando um Item Existente

1.  Na tabela de itens, encontre o item que deseja modificar.
2.  Clique no botão **"Editar"** na linha correspondente àquele item.
3.  O formulário "Adicionar/Editar Item do Cardápio" será preenchido com os dados do item selecionado. O botão de salvar mudará para **"Atualizar Item"**.
4.  Modifique os campos conforme necessário.
5.  Clique no botão **"Atualizar Item"**.
6.  As alterações serão salvas e a tabela será atualizada.

### Limpando o Formulário

Se você preencheu o formulário mas decidiu não salvar (ou após salvar e querer adicionar outro item novo), clique em **"Limpar Formulário"**. Isso limpará todos os campos e redefinirá o botão de salvar para "Salvar Item".

### Excluindo um Item

1.  Na tabela de itens, encontre o item que deseja excluir.
2.  Clique no botão **"Excluir"** na linha correspondente.
3.  Uma mensagem de confirmação aparecerá. Confirme a exclusão.
4.  O item será removido permanentemente do banco de dados e da tabela. **Esta ação não pode ser desfeita.**

## 2. Configurações do Restaurante

Esta seção permite que você ajuste as configurações globais do seu restaurante que são usadas em várias partes do cardápio digital.

### Modificando Configurações

1.  Ao entrar nesta seção, um formulário será exibido com os campos de configuração atuais carregados do banco de dados.
2.  Os campos disponíveis incluem:
    *   **Nome do Restaurante**: O nome oficial do seu estabelecimento.
    *   **Telefone (WhatsApp)**: Número de telefone para contato via WhatsApp, no formato internacional (ex: `5511999999999`). Usado para o botão de compartilhamento de pedido.
    *   **Cidade (para PIX)**: Nome da sua cidade, usado na geração do código PIX.
    *   **Taxa de Entrega (R$)**: Valor padrão da taxa de entrega.
    *   **Emoji do Restaurante**: Um emoji que pode ser usado para representar seu restaurante.
    *   **Horário de Abertura (HH:MM)**: Hora em que o restaurante abre (formato 24h).
    *   **Horário de Fechamento (HH:MM)**: Hora em que o restaurante fecha (formato 24h).
    *   **Fuso Horário**: Fuso horário da sua localidade (ex: `America/Sao_Paulo`). Importante para o cálculo correto do status "Aberto/Fechado".
    *   **Google Place ID (opcional)**: O ID do seu estabelecimento no Google Maps. Se preenchido, o sistema poderá (em futuras atualizações) buscar horários de funcionamento automaticamente do Google. Use o [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id) do Google para encontrar o ID.
3.  Modifique os valores nos campos conforme necessário.
4.  Clique em **"Salvar Configurações"**. As alterações serão aplicadas.

### Recarregando Configurações

Se você fez alterações no formulário mas não quer salvá-las, pode clicar em **"Recarregar Configurações Atuais"**. Isso descartará suas alterações no formulário e o preencherá novamente com os dados atualmente salvos no banco de dados.

## 3. Gerenciar Pedidos

Esta seção permite visualizar os pedidos feitos pelos seus clientes e gerenciar seus status.

### Visualizando Pedidos

Ao acessar esta seção, uma lista de pedidos será carregada, exibindo:
*   **ID do Pedido**: O identificador único do pedido (ex: TEMBIU-WEB-...).
*   **Data**: Data e hora em que o pedido foi feito.
*   **Cliente**: Nome do cliente (se informado).
*   **Total**: Valor total do pedido.
*   **Status**: O status atual do pedido (ex: Pendente, Confirmado, Em Preparo).
*   **Ações**: Botão para "Ver Detalhes".

### Filtrando Pedidos

Acima da lista de pedidos, você encontrará opções de filtro:
*   **Filtrar por Status**: Selecione um status específico para ver apenas os pedidos com esse status.
*   **Filtrar por Data**: Selecione uma data para ver os pedidos feitos naquele dia.
*   Clique em **"Aplicar Filtros"** para atualizar a lista de acordo com os filtros selecionados.

### Ver Detalhes do Pedido e Atualizar Status

1.  Na lista de pedidos, clique no botão **"Ver Detalhes"** para o pedido desejado.
2.  Uma janela modal (pop-up) aparecerá com informações completas do pedido:
    *   ID do Pedido, Data, Nome e Telefone do Cliente (se disponíveis).
    *   Endereço de entrega completo (se disponível).
    *   Valor total.
    *   Lista detalhada dos itens pedidos, com quantidades e preços.
    *   ID interno do pedido no banco de dados (para referência).
3.  **Atualizar Status**:
    *   No modal, você verá um campo `Status Atual` com uma lista suspensa.
    *   Selecione o novo status desejado para o pedido (ex: de "Pendente" para "Confirmado", de "Confirmado" para "Em Preparo", etc.).
    *   Clique no botão **"Atualizar Status"**. O status será salvo e a lista de pedidos será atualizada.
4.  **Compartilhar Link do Pedido**:
    *   Clique em **"Compartilhar Link do Pedido"**. Uma caixa de diálogo aparecerá com um link direto para uma visualização de resumo daquele pedido específico. Você pode copiar este link e enviá-lo ao cliente, por exemplo.
5.  **Notificar Cliente (Conceitual)**:
    *   Este botão é um placeholder para uma futura funcionalidade de envio de notificações push para o cliente sobre atualizações de status. Atualmente, ele não executa nenhuma ação.
6.  Para fechar o modal, clique no "×" no canto superior direito.

---

Lembre-se de salvar as alterações regularmente. Se você encontrar algum problema ou tiver dúvidas, consulte a documentação principal do projeto ou procure suporte nos canais da comunidade.
