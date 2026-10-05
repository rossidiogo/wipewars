/* ================= language: English / Português (BR) =================
   Text is translated at the DOM level: every text node and a few attributes are matched
   against PT (exact strings) and RX (patterns with numbers). English stays the source of truth. */
let LANG=(save&&save.lang)||'en';
const PT={
/* title + chrome */
'Idle Auto-Battler':'Auto-Battler Idle','Welcome, Wiper!':'Bem-vindo, Limpador!','What should we call you?':'Como devemos te chamar?','Begin':'Começar','Enter':'Entrar','Continue':'Continuar','New game':'Novo jogo','Welcome back':'Bem-vindo de volta',
'Offline guest · progress saved on this device only':'Convidado offline · progresso salvo só neste aparelho','Signed in with claude.ai · cloud save on':'Conectado ao claude.ai · salvamento na nuvem ativo','Tap again to erase everything':'Toque de novo para apagar tudo',
'Your name':'Seu nome','Your name (2-14 characters)':'Seu nome (2-14 caracteres)','Player name':'Nome do jogador','Player name (2-14 characters)':'Nome do jogador (2-14 caracteres)',
'Calendar':'Calendário','Mail':'Correio','Recruit':'Recrutar','Quick Idle':'Idle Rápido','Guild':'Guilda','Friends':'Amigos','Settings':'Configurações','Home':'Início','Heroes':'Heróis','Bag':'Mochila','Shop':'Loja','Tasks':'Tarefas','Campaign':'Campanha','Formation':'Formação','Daily Tasks':'Tarefas Diárias','Daily Login':'Login Diário',
'Tap Battle to begin!':'Toque em Batalhar para começar!','Battle':'Batalhar','Idle Rewards':'Recompensas Idle','Claim':'Resgatar','Claimed':'Resgatado','Claim all':'Resgatar tudo','Collect':'Coletar','Collect now':'Coletar agora','Later':'Depois','Already claimed':'Já resgatado',
'‹ Back':'‹ Voltar','Back':'Voltar','Coming soon':'Em breve','soon':'em breve','Off':'Desligado','On':'Ligado','Done':'Pronto','Skip':'Pular','Next':'Próximo','Got it':'Entendi','Cancel':'Cancelar','Sure?':'Certeza?',
'Join or create a guild with your friend group':'Entre ou crie uma guilda com seu grupo de amigos','Team boss battles with shared rewards':'Batalhas contra chefes em equipe, com recompensas compartilhadas','Guild shop and weekly rankings':'Loja da guilda e rankings semanais',
'Guilds need the signed-in online version. Open the game from its shared link while signed in to claude.ai, with Contributor access.':'Guildas precisam da versão online com login. Abra o jogo pelo link compartilhado, conectado ao claude.ai, com acesso de Colaborador.',
/* campaign / stages */
'Where it all began':'Onde tudo começou','Everything is frozen. Even the condoms.':'Tudo está congelado. Até as camisinhas.','Sawdust, sparks and sandpaper':'Serragem, faíscas e lixa','Never put the box on your lap':'Nunca coloque a caixa no colo','Something is growing down here':'Algo está crescendo aqui embaixo',
'The Bathroom':'O Banheiro','The Deep Freeze':'O Congelamento Profundo','The Workshop':'A Oficina','The Car Ride':'O Passeio de Carro','The Basement':'O Porão',
'BOSS':'CHEFE','Chapter reward':'Recompensa do capítulo','Clear the previous chapter to unlock':'Complete o capítulo anterior para desbloquear','More chapters coming soon':'Mais capítulos em breve',
'Flee':'Fugir','Start battle':'Iniciar batalha','Team':'Equipe','Enemies':'Inimigos','Rewards':'Recompensas','Rewards (first clear bonus included)':'Recompensas (bônus de primeira vitória incluso)','Back row':'Fileira de trás','Front row':'Fileira da frente','empty':'vazio',
'Tap a hero, then tap a spot to move or swap.':'Toque em um herói e depois em uma posição para mover ou trocar.','Now tap the spot to move to (tap the same hero to cancel).':'Agora toque na posição de destino (toque no mesmo herói para cancelar).',
'Tanks':'Tanques','Ranged':'À distância','Melee':'Corpo a corpo','Normal':'Normal','1 drop':'1 item','2 drops':'2 itens',
'Auto ultimates: Off':'Ultimates automáticas: Desligado','Auto ultimates: On':'Ultimates automáticas: Ligado','Victory':'Vitória','Defeat':'Derrota','Defeated':'Derrotado','Next stage':'Próxima fase','Map':'Mapa','Retry':'Tentar de novo','Your team was wiped out. Level up your heroes or equip better gear.':'Sua equipe foi derrotada. Suba o nível dos heróis ou equipe itens melhores.',
'Not recruited yet. Try the Recruit screen!':'Ainda não recrutado. Experimente a tela Recrutar!','You need at least one hero':'Você precisa de pelo menos um herói','Level cap — raise your player level':'Nível máximo — suba seu nível de jogador',
/* monsters */
'Toilet Paper':'Papel Higiênico','Clorox Wipes':'Lenços Clorox','Big Head':'Cabeção','Bottle':'Frasco','Boss':'Chefe','Frozen Condom':'Camisinha Congelada','Permafrost Prophylactic':'Preservativo Permafrost','Sandpaper Belt':'Cinta de Lixa','Belt Sander':'Lixadeira de Cinta','Burnt Mini Pizza':'Mini Pizza Queimada','Dropped Pizza':'Pizza Caída','Cobweb Roll':'Rolo de Teia','Mold Spray':'Spray de Mofo',
/* heroes */
'Cowboy Tank':'Tanque Cowboy','Energy Drink Tank':'Tanque do Energético','Tank (skills TBD)':'Tanque (habilidades a definir)','Bird Summoner':'Invocador de Pássaros','Deadeye Archer':'Arqueiro Deadeye','Mango Sharpshooter':'Atirador de Mangas','Tiger Druid':'Druida Tigrinho','Street Fighter':'Lutador de Rua','Hacker Assassin':'Assassino Hacker','Smoke Medic':'Médico da Fumaça','Fanfarra Drummer':'Baterista da Fanfarra','Curse Shaman':'Xamã das Maldições','Barista Medic (placeholder)':'Médico Barista (provisório)',
'Tank':'Tanque','Ranged DPS':'DPS à Distância','Melee DPS':'DPS Corpo a Corpo','Support':'Suporte','Locked':'Bloqueado','On team':'Na equipe','Level':'Nível','Stars':'Estrelas','Health':'Vida','Attack':'Ataque','Power':'Poder','Level up':'Subir de nível','Equipment':'Equipamento','Best set:':'Melhor conjunto:','Equip best':'Equipar o melhor','Unequip hero':'Desequipar herói','Equip':'Equipar','Unequip':'Desequipar','Best gear equipped':'Melhor equipamento colocado',
'Jewelry slots (ring, necklace, belt) unlock in a future update.':'Espaços de joias (anel, colar, cinto) serão liberados em uma atualização futura.','Ring':'Anel','Necklace':'Colar','Belt':'Cinto','Helm':'Elmo','Armor':'Armadura','Gloves':'Luvas','Boots':'Botas','Weapon':'Arma','Go to Recruit':'Ir para Recrutar','Item':'Item',
'Select an item to compare.':'Selecione um item para comparar.','Currently equipped':'Equipado no momento','Selecione':'Selecione',
/* ultimates */
'Hold the Line':'Segurar a Linha','Energy Overload':'Sobrecarga de Energia','Guard Up':'Guarda Alta','Summon Cockatiel':'Invocar Calopsita','Deadeye Volley':'Saraivada Deadeye','Mango Barrage':'Chuva de Mangas','Tiger Form':'Forma de Tigre','Combo Breaker':'Quebra-Combo','Root Access':'Acesso Root','Smoke Session':'Sessão de Fumaça','Fanfarra!':'Fanfarra!','Hex of Ruin':'Praga da Ruína','Fresh Brew':'Café Fresquinho',
'Gain a shield worth 40% of max health.':'Ganha um escudo de 40% da vida máxima.',
'Drinks a can: grows huge, heals 30%, gains a 30% shield and +60% attack for 8s.':'Bebe uma lata: fica gigante, cura 30%, ganha 30% de escudo e +60% de ataque por 8s.',
'Placeholder: shields the whole team for 20% of his max health.':'Provisório: protege toda a equipe com 20% da vida máxima dele.',
'His cockatiel dives in for 5x attack damage to one enemy.':'A calopsita mergulha e causa 5x de dano de ataque em um inimigo.',
'Fires 4 arrows at random enemies for 1.7x attack each.':'Dispara 4 flechas em inimigos aleatórios, 1,7x de ataque cada.',
'Hurls a mango for 4.5x damage to one enemy, splashing 1.2x on the rest.':'Arremessa uma manga: 4,5x de dano em um inimigo e 1,2x nos demais.',
'Turns into a huge tiger for 10s: +80% attack, takes 25% less damage, heals 15%.':'Vira um tigre gigante por 10s: +80% de ataque, recebe 25% menos dano e cura 15%.',
'A 6-hit combo on one enemy; the finisher hits for 2.2x.':'Um combo de 6 golpes em um inimigo; o golpe final causa 2,2x.',
'Freezes every enemy for 3s and deals 5.5x damage to the weakest in the back.':'Congela todos os inimigos por 3s e causa 5,5x de dano ao mais fraco da retaguarda.',
'A cloud of smoke heals every ally for a large amount.':'Uma nuvem de fumaça cura bastante todos os aliados.',
'Drums rally the team: +35% attack and +25% speed for 10s. Passive: allies hit 8% harder.':'Os tambores animam a equipe: +35% de ataque e +25% de velocidade por 10s. Passiva: aliados batem 8% mais forte.',
'Curses all enemies for 10s: -35% attack and +25% damage taken. Passive: his hits curse (+12% damage taken).':'Amaldiçoa todos os inimigos por 10s: -35% de ataque e +25% de dano recebido. Passiva: seus golpes amaldiçoam (+12% de dano recebido).',
'Brew a pot of coffee and heal every ally for a large amount.':'Passa uma cafeteira e cura bastante todos os aliados.',
/* items + sets */
'Common':'Comum','Magic':'Mágico','Rare':'Raro','Legendary':'Lendário','Epic':'Épico','Bulwark':'Baluarte','Fury':'Fúria','Mercy':'Misericórdia','Built for the Tank':'Feito para o Tanque','Built for the Damage Dealer':'Feito para o Atacante','Built for the Support':'Feito para o Suporte',
'All':'Todos','Fuse all':'Fundir tudo','Scrap...':'Desmontar...','Fuse 2 identical items into 1 of the next level. Common → Magic → Rare → Legendary, 3 levels each.':'Funda 2 itens idênticos em 1 do próximo nível. Comum → Mágico → Raro → Lendário, 3 níveis cada.',
'Nothing here yet.':'Nada aqui ainda.','Win stages, claim idle chests and open shop chests to find gear.':'Vença fases, resgate baús idle e abra baús da loja para achar equipamentos.','Fused!':'Fundido!','Nothing to fuse':'Nada para fundir','Scrap all unequipped items of a tier for Chaos. Equipped gear is never scrapped.':'Desmonte todos os itens não equipados de um tipo por Caos. Equipamentos em uso nunca são desmontados.','Tap again to confirm':'Toque de novo para confirmar','Scrap Items':'Desmontar Itens',
'Bronze Key':'Chave de Bronze','Silver Key':'Chave de Prata','Gold Key':'Chave de Ouro',
/* tasks, calendar, mail */
'Daily':'Diárias','Achievements':'Conquistas','Daily Activity':'Atividade Diária','Activity Reward':'Recompensa de Atividade','Activity reward':'Recompensa de Atividade','XP':'XP','pts':'pts',
'Claim idle rewards':'Resgatar recompensas idle','Win 3 battles':'Vença 3 batalhas','Win 10 battles':'Vença 10 batalhas','Clear a new stage':'Complete uma fase nova','Level up a hero':'Suba o nível de um herói','Fuse an item':'Funda um item','Open a chest':'Abra um baú','Claim the free daily gift':'Resgate o presente diário grátis','Cast 5 ultimates':'Use 5 ultimates',
'Warm-up':'Aquecimento','Wipe Enthusiast':'Entusiasta da Limpeza','Serial Wiper':'Limpador em Série','Wipe Legend':'Lenda da Limpeza','Treasure Hunter':'Caçador de Tesouros','Chest Goblin':'Goblin dos Baús','Blacksmith':'Ferreiro','Master Smith':'Mestre Ferreiro','Spell Slinger':'Lançador de Magias','Ultimate Fan':'Fã de Ultimates','Chapter 1 Cleared':'Capítulo 1 Completo','Halfway There':'Na Metade do Caminho','Deep Cleaner':'Limpador Profundo','Backseat Survivor':'Sobrevivente do Banco de Trás','Campaign Complete':'Campanha Completa','Rising Star':'Estrela em Ascensão','Veteran':'Veterano','Elite':'Elite',
'Win 50 battles':'Vença 50 batalhas','Win 200 battles':'Vença 200 batalhas','Win 1,000 battles':'Vença 1.000 batalhas','Open 10 chests':'Abra 10 baús','Open 100 chests':'Abra 100 baús','Fuse 10 times':'Funda 10 vezes','Fuse 100 times':'Funda 100 vezes','Cast 25 ultimates':'Use 25 ultimates','Cast 250 ultimates':'Use 250 ultimates','Clear stage 10':'Complete a fase 10','Clear stage 20':'Complete a fase 20','Clear stage 30':'Complete a fase 30','Clear stage 40':'Complete a fase 40','Clear stage 50':'Complete a fase 50','Reach player level 5':'Alcance o nível de jogador 5','Reach player level 15':'Alcance o nível de jogador 15','Reach player level 30':'Alcance o nível de jogador 30',
'Log in every day to keep your streak. Missing a day restarts it.':'Entre todos os dias para manter a sequência. Perder um dia reinicia tudo.','Come back tomorrow':'Volte amanhã','1 item':'1 item',
'Welcome to Wipe Wars!':'Bem-vindo ao Wipe Wars!','A little something to get your run started. Open chests in the shop, equip your heroes and push the campaign.':'Um presentinho para começar. Abra baús na loja, equipe seus heróis e avance na campanha.','Thanks for testing':'Obrigado por testar','Early tester bonus - more is coming as the game grows.':'Bônus de testador antecipado — vem mais conforme o jogo cresce.','No mail.':'Sem correio.',
'You were away for':'Você ficou fora por','Your heroes kept fighting.':'Seus heróis continuaram lutando.',
/* shop */
'Deals':'Ofertas','Chests':'Baús','Chaos':'Caos','Divine':'Divino','Refreshes in':'Atualiza em','Refresh':'Atualizar','FREE':'GRÁTIS','Sold out':'Esgotado','Purchased':'Comprado','No refreshes left':'Sem atualizações restantes','Deals refreshed':'Ofertas atualizadas','Not enough Chaos':'Chaos insuficiente','Not enough Divine':'Divino insuficiente','Not enough Divine Orbs':'Orbes Divinos insuficientes','Not enough keys':'Chaves insuficientes','Best pull first':'Melhor item primeiro',
'Open Quick Idle':'Abrir Idle Rápido','Bundle sizes grow as you clear more stages.':'Os pacotes crescem conforme você completa fases.','Real-money purchases are not available in this prototype.':'Compras com dinheiro real não estão disponíveis neste protótipo.','Handful of Divine Orbs':'Punhado de Orbes Divinos','Pouch of Divine Orbs':'Bolsa de Orbes Divinos','Sack of Divine Orbs':'Saco de Orbes Divinos','Chest of Divine Orbs':'Baú de Orbes Divinos','Vault of Divine Orbs':'Cofre de Orbes Divinos',
'Bronze Chest':'Baú de Bronze','Silver Chest':'Baú de Prata','Gold Chest':'Baú de Ouro','Common loot, great for fusing.':'Itens comuns, ótimos para fundir.','Rare or better guaranteed every 10 opens.':'Raro ou melhor garantido a cada 10 aberturas.','Rare every 10 opens, Legendary guaranteed every 40.':'Raro a cada 10 aberturas, Lendário garantido a cada 40.','Open ×1':'Abrir ×1','Open ×10':'Abrir ×10','Use Bronze Keys':'Usar Chaves de Bronze','Use Silver Keys':'Usar Chaves de Prata','Use Gold Keys':'Usar Chaves de Ouro','Opening 10 at once costs 10% less. Odds are shown on every chest.':'Abrir 10 de uma vez custa 10% menos. As chances aparecem em cada baú.','Rare+ in':'Raro+ em','opens':'aberturas','opens · Legendary in':'aberturas · Lendário em',
'No quick idles left today. Come back tomorrow.':'Sem idles rápidos hoje. Volte amanhã.',
/* settings */
'Digas mode':'Modo Digas','Digas mode (unlock everything)':'Modo Digas (liberar tudo)','Unlocks all stages, tons of currency, high hero levels and legendary gear. Turning it off restores your real progress.':'Libera todas as fases, muita moeda, níveis altos de heróis e equipamentos lendários. Ao desligar, seu progresso real volta.','Digas mode ON: everything unlocked':'Modo Digas LIGADO: tudo liberado','Digas mode off: progress restored':'Modo Digas desligado: progresso restaurado','Heroes can’t die':'Heróis não morrem','One-hit kills':'Mortes em um golpe','Ultimates always ready':'Ultimates sempre prontas','Watch chapter cutscene':'Ver cena do capítulo',
'Profile':'Perfil','Game':'Jogo','Auto-start next stage after a win':'Iniciar a próxima fase automaticamente após vencer','Auto ultimates':'Ultimates automáticas','Sound effects':'Efeitos sonoros','Music':'Música','Tutorial with Julia':'Tutorial com a Julia','Replay':'Rever','Language':'Idioma','English':'Português','Testing tools':'Ferramentas de teste','Skip 1 hour of idle time':'Pular 1 hora de tempo idle','Skip 1h':'Pular 1h','Add 1,000 Divine':'Adicionar 1.000 Divinos','Add 50,000 Chaos':'Adicionar 50.000 Caos','Add 5 of every key':'Adicionar 5 de cada chave','Unlock next stage':'Liberar próxima fase','+1 stage':'+1 fase','Raise player level (adds XP)':'Subir nível de jogador (adiciona XP)','Reset daily tasks, shop and quick idle':'Reiniciar tarefas diárias, loja e idle rápido','Reset':'Reiniciar','Danger zone':'Zona de perigo','Erase all progress':'Apagar todo o progresso','Erase':'Apagar',
/* friends / guild */
'Friends need the signed-in online version. Open the game from its shared link while signed in to claude.ai, and make sure the owner gave you Contributor access.':'Amigos precisam da versão online com login. Abra o jogo pelo link compartilhado, conectado ao claude.ai, e confirme que o dono deu acesso de Colaborador.',
'Requests':'Pedidos','Add':'Adicionar','Gifts claimed!':'Presentes resgatados!','No friends yet. Use the Add tab to find people by name.':'Nenhum amigo ainda. Use a aba Adicionar para achar pessoas pelo nome.','Gift':'Presente','Sent':'Enviado','Gift sent! +10 Chaos Orbs':'Presente enviado! +10 Orbes do Caos','No pending requests.':'Nenhum pedido pendente.','Accept':'Aceitar','Friend added!':'Amigo adicionado!','Nothing sent.':'Nada enviado.','Find a player':'Encontrar jogador','Type a name (2+ letters)':'Digite um nome (2+ letras)','No players found. They need to open the game once to appear.':'Nenhum jogador encontrado. A pessoa precisa abrir o jogo uma vez para aparecer.','Pending':'Pendente','Request sent':'Pedido enviado','Unknown':'Desconhecido',
'The Plunger King':'O Rei do Desentupidor','Sir Scrubs-a-Lot':'Sir Esfrega-Muito','Duchess of Dust':'Duquesa da Poeira','Baron Von Mold':'Barão Von Mofo','Name needs 3+ letters':'O nome precisa de 3+ letras','Guild created!':'Guilda criada!','Joined the guild!':'Você entrou na guilda!','No attacks left today':'Sem ataques hoje','Guild boss defeated!':'Chefe da guilda derrotado!','Create a guild':'Criar uma guilda','Guild name':'Nome da guilda','Create':'Criar','Could not create':'Não foi possível criar','Find a guild':'Encontrar uma guilda','Search by name (or leave empty)':'Buscar por nome (ou deixe vazio)','No guilds found yet. Create the first one!':'Nenhuma guilda ainda. Crie a primeira!','Join':'Entrar','Could not join':'Não foi possível entrar','Loading guild...':'Carregando guilda...','Weekly boss':'Chefe semanal','Attack failed':'Falha no ataque','Reward claimed':'Recompensa resgatada','Claim reward':'Resgatar recompensa','Claim failed':'Falha ao resgatar','Damage ranking':'Ranking de dano','Leave guild':'Sair da guilda','Tap again to leave':'Toque de novo para sair',
/* tutorial (whole strings, with markup) */
'Hi, I’m <b>Julia</b>! I’ll show you around Wipe Wars. Ready?':'Oi, eu sou a <b>Julia</b>! Vou te mostrar o Wipe Wars. Pronto?',
'Tap <b>Battle</b> to start fighting. Your heroes attack on their own — no tapping needed.':'Toque em <b>Batalhar</b> para começar a lutar. Seus heróis atacam sozinhos — não precisa ficar tocando.',
'I left you <b>10 Recruit Tickets</b>! Open <b>Recruit</b> on the right side to meet more friends for your team.':'Deixei <b>10 Tickets de Recrutamento</b> para você! Abra <b>Recrutar</b> do lado direito para conhecer mais amigos para a sua equipe.',
'Even when you close the game, your heroes keep earning <b>Chaos Orbs</b> (up to 8 hours). Come back and claim the chest!':'Mesmo com o jogo fechado, seus heróis continuam ganhando <b>Orbes do Caos</b> (até 8 horas). Volte e resgate o baú!',
'Use the buttons along the bottom to visit <b>Heroes</b>, the <b>Bag</b>, the Shop and more. I’ll pop in with tips on each one.':'Use os botões lá embaixo para visitar os <b>Heróis</b>, a <b>Mochila</b>, a Loja e mais. Vou aparecer com dicas em cada uma.',
'When a hero’s <b>mana bar</b> fills up, tap their portrait at the bottom to cast an <b>ultimate</b>.':'Quando a <b>barra de mana</b> de um herói enche, toque no retrato dele lá embaixo para usar a <b>ultimate</b>.',
'Beat a stage’s <b>Big Head</b> boss to unlock the next one. Lose? Level up and try again!':'Derrote o chefe <b>Cabeção</b> da fase para liberar a próxima. Perdeu? Suba de nível e tente de novo!',
'Spend Chaos Orbs to <b>level up</b> your heroes. A hero can’t go above your player level.':'Gaste Orbes do Caos para <b>subir de nível</b> seus heróis. Um herói não passa do seu nível de jogador.',
'Build a team of up to 4 on the <b>Formation</b> screen. <b>Tanks</b> soak damage, <b>ranged DPS</b> can hit the back row, and <b>supports</b> heal, buff, or curse.':'Monte uma equipe de até 4 na tela de <b>Formação</b>. <b>Tanques</b> absorvem dano, <b>DPS à distância</b> acerta a fileira de trás, e <b>suportes</b> curam, fortalecem ou amaldiçoam.',
'Every pull brings a friend. The first time you pull someone, they join your crew!':'Cada sorteio traz um amigo. Na primeira vez que você tira alguém, a pessoa entra para a sua turma!',
'Pulling someone you already have gives <b>shards</b>. Collect enough to give them more <b>stars</b> (+10% stats each).':'Tirar alguém que você já tem dá <b>fragmentos</b>. Junte o bastante para dar mais <b>estrelas</b> (+10% de atributos cada).',
'A <b>new friend is guaranteed</b> within 10 pulls, and your 2 <b>favorites</b> show up twice as often.':'Um <b>amigo novo é garantido</b> em até 10 sorteios, e seus 2 <b>favoritos</b> aparecem o dobro das vezes.',
'Gear comes in 4 tiers. Fuse two identical pieces to raise their stars.':'Os equipamentos têm 4 raridades. Funda duas peças idênticas para subir as estrelas.',
'Tap <b>Equip best</b> to gear everyone up fast. Matching <b>set pieces</b> give bonus stats!':'Toque em <b>Equipar o melhor</b> para equipar todo mundo rápido. <b>Peças do mesmo conjunto</b> dão atributos extras!',
/* recruit */
'Recruit ×1':'Recrutar ×1','Recruit ×10':'Recrutar ×10','Buy a ticket':'Comprar um ticket','Earn tickets by clearing new stages, daily login, and task milestones.':'Ganhe tickets completando fases novas, no login diário e nas metas de tarefas.','New friend guarantee':'Garantia de amigo novo','Favorites':'Favoritos','Collection':'Coleção','Pull rarity':'Raridade do sorteio','Results':'Resultados','NEW!':'NOVO!','NEW FRIEND!':'AMIGO NOVO!','Tap to finish':'Toque para terminar','Skip all':'Pular tudo','Max stars':'Estrelas no máximo','MAX':'MÁX','Not recruited yet':'Ainda não recrutado','Pick up to 2 favorites':'Escolha até 2 favoritos','Not enough recruit tickets':'Tickets de recrutamento insuficientes','+1 recruit ticket':'+1 ticket de recrutamento','Recruiting…':'Recrutando…',
'Every pull brings a friend. New faces are guaranteed, and repeats become shards that give your friends more stars.':'Cada sorteio traz um amigo. Caras novas são garantidas, e repetidos viram fragmentos que dão mais estrelas aos seus amigos.',
'Everyone has joined your crew! Repeats now go straight into star shards.':'Todo mundo já entrou na sua turma! Repetidos agora viram fragmentos de estrela.',
/* cutscenes */
'Every legend starts somewhere unglamorous.':'Toda lenda começa em algum lugar sem glamour.','At the end of the hall, someone with a perfectly normal-sized head waits.':'No fim do corredor, alguém com uma cabeça de tamanho perfeitamente normal espera.','Tonight it starts in the bathroom, and the toilet paper has opinions.':'Hoje à noite tudo começa no banheiro, e o papel higiênico tem opiniões.','[Placeholder cutscene: chapter 1]':'[Cena provisória: capítulo 1]',
'The cold came first. Then the condoms.':'Primeiro veio o frio. Depois as camisinhas.','Something very large, with a very large head, is waiting at the bottom of the freezer.':'Algo muito grande, com uma cabeça muito grande, espera no fundo do freezer.','[Placeholder cutscene: chapter 2]':'[Cena provisória: capítulo 2]',
'The workshop smells like sawdust. The machines are already running.':'A oficina cheira a serragem. As máquinas já estão ligadas.','[Placeholder cutscene: chapter 3]':'[Cena provisória: capítulo 3]',
'The pizza was fine until the first sharp turn.':'A pizza estava ótima até a primeira curva fechada.','Then the box slid off your lap, and the pizza had feelings about it.':'Aí a caixa escorregou do seu colo, e a pizza ficou com sentimentos.','[Placeholder cutscene: chapter 4]':'[Cena provisória: capítulo 4]',
'Down the stairs, down, down. The head has grown.':'Escada abaixo, abaixo, abaixo. A cabeça cresceu.','[Placeholder cutscene: chapter 5]':'[Cena provisória: capítulo 5]','Tap to continue':'Toque para continuar',
/* misc */
'Boss':'Chefe','Wipe Wars':'Wipe Wars','Wiper':'Limpador'
};
const TIERW={Common:['Comum','Comum','Comuns'],Magic:['Mágico','Mágica','Mágicas'],Rare:['Raro','Rara','Raras'],Legendary:['Lendário','Lendária','Lendárias']};
const TYPEW={Helm:['Elmo',0],Armor:['Armadura',1],Gloves:['Luvas',2],Boots:['Botas',2],Weapon:['Arma',1]};
const SETW={Bulwark:'Baluarte',Fury:'Fúria',Mercy:'Misericórdia'};
const RARW={Normal:'Normal',Magic:'Mágico',Rare:'Raro',Legendary:'Lendário',Common:'Comum',Epic:'Épico'};
function tx(s){return t(s);}
const RX=[
 [/^Chapter (\d+) · Stage (\S+)$/,(a,b)=>'Capítulo '+a+' · Fase '+b],
 [/^Chapter (\d+) · (.+)$/,(a,b)=>'Capítulo '+a+' · '+t(b)],
 [/^Chapter (\d+) complete!$/,a=>'Capítulo '+a+' completo!'],
 [/^Chapter (\d+)$/,a=>'Capítulo '+a],
 [/^(.+) conquered\. Here is your chapter reward\.$/,a=>t(a)+' conquistado. Aqui está sua recompensa do capítulo.'],
 [/^BOSS · Stage (\S+)$/,a=>'CHEFE · Fase '+a],
 [/^Stage (\S+) · First clear!$/,a=>'Fase '+a+' · Primeira vitória!'],
 [/^Stage (\S+) · Boss$/,a=>'Fase '+a+' · Chefe'],
 [/^Stage (\S+)$/,a=>'Fase '+a],
 [/^Level (\d+) · Stage (\S+)$/,(a,b)=>'Nível '+a+' · Fase '+b],
 [/^Level (\d+)$/,a=>'Nível '+a],
 [/^Lv (\d+)(?: · (\d+)★)?$/,(a,b)=>'Nv '+a+(b?' · '+b+'★':'')],
 [/^([\d.,]+) Chaos \/ min$/,a=>a+' Caos / min'],
 [/^([\d.,]+) Chaos$/,a=>a+' Caos'],
 [/^([\d.,]+) Divine$/,a=>a+' Divinos'],
 [/^(\d+)h (\d+)m \/ 8h( — full)?$/,(a,b,c)=>a+'h '+b+'m / 8h'+(c?' — cheio':'')],
 [/^(\d+)h (\d+)m of progress collected$/,(a,b)=>a+'h '+b+'m de progresso coletado'],
 [/^(\d+)m of progress collected$/,a=>a+'m de progresso coletado'],
 [/^Resets in (.+)$/,a=>'Reinicia em '+a],
 [/^Refreshes in (.+)$/,a=>'Atualiza em '+a],
 [/^(\d+) unclaimed$/,a=>a+' para resgatar'],
 [/^(\d+) items in bag · (\d+) equipped$/,(a,b)=>a+' itens na mochila · '+b+' equipado(s)'],
 [/^(\d+) tickets$/,a=>a+' tickets'],
 [/^Day (\d+)$/,a=>'Dia '+a],[/^Claim day (\d+)$/,a=>'Resgatar dia '+a],
 [/^(\d+) hours of idle income at your current rate$/,a=>a+' horas de renda idle no seu ritmo atual'],
 [/^Instantly collect (\d+)h of idle rewards\. (\d+) left today\.$/,(a,b)=>'Colete na hora '+a+'h de recompensas idle. '+b+' restante(s) hoje.'],
 [/^Free \((\d+) left today\)$/,a=>'Grátis ('+a+' restante(s) hoje)'],
 [/^Collect\s+(.+)$/,a=>'Coletar '+a],
 [/^Ultimate — (.+)$/,a=>'Ultimate — '+t(a)],
 [/^(.+?) Needs (\d+) mana\.$/,(a,b)=>t(a)+' Custa '+b+' de mana.'],
 [/^(.+) · (Tank|Ranged DPS|Melee DPS|Support)$/,(a,b)=>t(a)+' · '+t(b)],
 [/^(.+) · (Tank|Ranged DPS|Melee DPS|Support) ·$/,(a,b)=>t(a)+' · '+t(b)+' ·'],
 [/^(\d+) \/ (\d+) remaining$/,(a,b)=>a+' / '+b+' restantes'],
 [/^(\d+) \/ (\d+) · (Normal|Magic|Rare|Legendary)$/,(a,b,c)=>a+' / '+b+' · '+RARW[c]],
 [/^(\d+)× (.+)$/,(a,b)=>a+'× '+t(b)],
 [/^Common (\d+)%$/,a=>'Comum '+a+'%'],[/^Magic ([\d.]+)%$/,a=>'Mágico '+a+'%'],[/^Rare ([\d.]+)%$/,a=>'Raro '+a+'%'],[/^Legendary ([\d.]+)%$/,a=>'Lendário '+a+'%'],
 [/^(Common|Magic|Rare|Legendary) (Bulwark|Fury|Mercy) (Helm|Armor|Gloves|Boots|Weapon)$/,(a,b,c)=>{const ty=TYPEW[c];return ty[0]+' '+SETW[b]+' '+TIERW[a][ty[1]];}],
 [/^(Bulwark|Fury|Mercy) set — (.+)$/,(a,b)=>'Conjunto '+SETW[a]+' — '+t(b)],
 [/^Item level (\d+) \/ 12$/,a=>'Nível do item '+a+' / 12'],
 [/^\+(\d+) shards$/,a=>'+'+a+' fragmentos'],
 [/^Joined your crew with a bonus of \+(\d+) shards$/,a=>'Entrou para a turma com um bônus de +'+a+' fragmentos'],
 [/^(\d+) \/ (\d+) to next star$/,(a,b)=>a+' / '+b+' para a próxima estrela'],
 [/^(\d+) new friends? · (\d+) shards total$/,(a,b)=>a+(a==='1'?' amigo novo':' amigos novos')+' · '+b+' fragmentos no total'],
 [/^(\d+) shards total$/,a=>a+' fragmentos no total'],
 [/^Tap to continue \((\d+) \/ (\d+)\)$/,(a,b)=>'Toque para continuar ('+a+' / '+b+')'],
 [/^Star up\s+(\d+) \/ (\d+) shards$/,(a,b)=>'Subir estrela  '+a+' / '+b+' fragmentos'],
 [/^(.+) reached (\d+) stars?!$/,(a,b)=>a+' chegou a '+b+(b==='1'?' estrela!':' estrelas!')],
 [/^A new friend is guaranteed within (\d+) pulls?\. (\d+) still to find\.$/,(a,b)=>'Um amigo novo é garantido em '+a+(a==='1'?' sorteio':' sorteios')+'. Faltam '+b+' para achar.'],
 [/^(\d+) \/ 2 · 2× chance$/,a=>a+' / 2 · chance 2×'],
 [/^(\d+)% · \+(\d+) shards$/,(a,b)=>a+'% · +'+b+' fragmentos'],
 [/^Star costs: (.+) shards\. Each star adds \+10% stats\.$/,a=>'Custo das estrelas: '+a+' fragmentos. Cada estrela dá +10% de atributos.'],
 [/^Not recruited yet\. Pull them on the Recruit screen\. (\d+) shards saved\.$/,a=>'Ainda não recrutado. Sorteie na tela Recrutar. '+a+' fragmentos guardados.'],
 [/^Team is full \((\d+)\)\. Remove a hero first\.$/,a=>'Equipe cheia ('+a+'). Remova um herói primeiro.'],
 [/^Thanks for helping (.+)$/,a=>'Obrigado por ajudar '+a],
 [/^(\d+)\/(\d+)\/(\d{4})$/,(m,d,y)=>d+'/'+m+'/'+y],
 [/^Fused (\d+) ?(.*)$/,(a,b)=>'Fundidos '+a+(b?' '+t(b):'')],
 [/^Scrapped for (.+)$/,a=>'Desmontado por '+a],
 [/^Fuse 2 → (.+)$/,a=>'Fundir 2 → '+t(a)],
 [/^Scrap all (.+)$/,a=>'Desmontar todos '+t(a)],
 [/^Scrap 1\s+(.+)$/,a=>'Desmontar 1  '+a],
 [/^Reach (\d+) activity points to unlock\.$/,a=>'Alcance '+a+' pontos de atividade para liberar.'],
 [/^Claim (.+)$/,a=>'Resgatar '+t(a)],
 [/^Player level (\d+)!$/,a=>'Nível de jogador '+a+'!'],
 [/^(\d+) (?:\/ )?(\d+) members$/,(a,b)=>a+' membros']
];
function trStr(s){
  if(Object.prototype.hasOwnProperty.call(PT,s))return PT[s];
  for(const [r,f] of RX){const m=s.match(r);if(m)return f(...m.slice(1));}
  return null;
}
function t(s){
  if(LANG!=='pt'||typeof s!=='string')return s;
  const k=s.trim();if(!k)return s;
  const r=trStr(k);return r===null?s:s.replace(k,r);
}
/* ---- DOM translation ---- */
const ORIGT=new WeakMap();
function tNode(n){
  const cur=n.nodeValue;let o=ORIGT.get(n);
  if(!o||o.out!==cur){o={src:cur,out:cur};ORIGT.set(n,o);}
  const out=LANG==='pt'?t(o.src):o.src;
  if(out!==cur){o.out=out;n.nodeValue=out;}
}
const TATTR=['placeholder','aria-label','title'];
function tAttrs(e){
  TATTR.forEach(a=>{
    if(!e.hasAttribute||!e.hasAttribute(a))return;
    const k='data-en-'+a;if(!e.hasAttribute(k))e.setAttribute(k,e.getAttribute(a));
    const src=e.getAttribute(k),out=LANG==='pt'?t(src):src;if(e.getAttribute(a)!==out)e.setAttribute(a,out);
  });
}
function tWalk(root){
  if(root.nodeType===3){tNode(root);return;}
  if(root.nodeType!==1)return;
  if(['SCRIPT','STYLE'].includes(root.tagName))return;
  tAttrs(root);
  for(let c=root.firstChild;c;c=c.nextSibling)tWalk(c);
}
let tObs=null;
function startLang(){
  if(tObs)return;
  tObs=new MutationObserver(ms=>{
    ms.forEach(m=>{
      if(m.type==='characterData')tNode(m.target);
      else if(m.type==='attributes')tAttrs(m.target);
      else m.addedNodes.forEach(n=>tWalk(n));
    });
  });
  tObs.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:TATTR});
}
function setLang(l){
  LANG=l;save.lang=l;persist();document.documentElement.lang=l==='pt'?'pt-BR':'en';
  tWalk(document.body);
  if(typeof curScreen!=='undefined'&&DRAW[curScreen])DRAW[curScreen]();
  if(typeof syncCur==='function')syncCur();
}
function initLang(){document.documentElement.lang=LANG==='pt'?'pt-BR':'en';startLang();tWalk(document.body);}
window.addEventListener('load',initLang);
