import sys
sys.path.insert(0,'/mnt/user-data/working/src20/art2')
from ph_sos import *
def fxs(kind):
    if kind=='drops': return [drop(310,214),drop(330,206,5)+drop(350,222,4),drop(372,246,4)]
    if kind=='mango': return [prop('mango',318,206,0,0),prop('mango',352,188,0,0)+puff(384,176,4,'#ffd84a'),puff(390,170,6,'#ffd84a')+puff(374,200,4,'#f0a020')]
    if kind=='arrow': return ['<path d="M300 214 H350" stroke="#e8e8d0" stroke-width="4"/>','<path d="M310 206 H376" stroke="#e8e8d0" stroke-width="4"/><path d="M368 200 L384 206 L368 212Z" fill="#c0cadc" stroke="#2a1a24" stroke-width="2"/>','<path d="M330 200 H400" stroke="#9ae070" stroke-width="3" opacity=".6"/>']
    if kind=='slash': return ['','<path d="M300 170 Q340 200 330 260" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" opacity=".9"/>','<path d="M316 160 Q364 200 346 270" stroke="#ffd84a" stroke-width="6" fill="none" stroke-linecap="round" opacity=".8"/>']
    if kind=='code': return [code(300,200),code(320,176)+code(350,214),code(340,160)+code(380,196)+code(360,232)]
    if kind=='smoke': return [puff(300,200,9),puff(318,184,12)+puff(346,170,8),puff(340,176,14)+puff(372,160,10)+puff(364,196,8)]
    if kind=='notes': return [note(310,200),note(326,176)+note(356,204),note(340,160)+note(374,190,'#ff8aa8')]
    if kind=='curse': return ['<circle cx="310" cy="206" r="9" fill="#b050ff" opacity=".8"/>','<circle cx="326" cy="196" r="14" fill="#b050ff" stroke="#4a1a8a" stroke-width="3" opacity=".85"/><circle cx="360" cy="214" r="8" fill="#e0a0ff" opacity=".8"/>','<circle cx="350" cy="200" r="18" fill="#b050ff" stroke="#4a1a8a" stroke-width="3" opacity=".6"/>']
    return ['','','']
C={
 'rafinha':dict(skin='green',tee=('#4a4a58','#26262e','#101014'),pants=('#2c3c78','#1c2050','#101030'),hair=('#2a2a2a','#14141a','#08080c'),hairs='horns',tusks=1,pat='claw',prop='can',wide=14,fx=fxs('drops'),acc=('#c0cadc','#8a96b8','#5a6488')),
 'lucao':dict(skin='tan',tee=('#8a96a8','#5a6478','#2c3448'),pants=('#5a4a3a','#3a2c24','#1c1410'),hair=('#7a5438','#3c2a20','#1c1410'),hairs='buzz',beard=1,pat='hoodie',prop='shield',wide=8,fx=fxs('slash'),acc=('#c0cadc','#8a96b8','#5a6488')),
 'copello':dict(skin='light',tee=('#ffd84a','#f0a020','#b87014'),pants=('#7a96d4','#4a62a8','#2c3c78'),hair=('#6a3c34','#3c2024','#1c0e18'),hairs='cap',cast=1,prop='mango',fx=fxs('mango'),acc=('#4ac060','#2c8a40','#1c5a2c')),
 'chavoso':dict(skin='tan',tee=('#3a6a44','#244a30','#142a1c'),pants=('#4a3a2c','#2c2018','#14100c'),hair=('#6a4a34','#3c2a1c','#1c1410'),hairs='hood',stache=1,pat='robe',prop='bow',fx=fxs('arrow'),acc=('#4a8a58','#2c5a38','#183a24')),
 'glem':dict(skin='tan',tee=('#7ac060','#3a8a40','#1c5a2c'),pants=('#7a5a3a','#4a3624','#2a1c10'),hair=('#4a3a2c','#2c2018','#14100c'),hairs='spiky',beard=1,pat='vest',prop='staff',wide=10,fx=fxs('slash'),acc=('#c08850','#8a5a3c','#5c3a38')),
 'malaguti':dict(skin='light',tee=('#7ad8ff','#3a98d8','#2a5ab0'),pants=('#ffd84a','#f0a020','#b87014'),hair=('#3c2024','#1c0e18','#0c0608'),hairs='buzz',stache=1,pat='floral',shorts=1,gloves=1,prop='none',fx=fxs('slash'),acc=('#c0cadc','#8a96b8','#5a6488')),
 'samuel':dict(skin='light',tee=('#4a4a5a','#2a2a38','#14141c'),pants=('#3a3a4a','#22222c','#101016'),hair=('#3c2a24','#1c1410','#0c0806'),hairs='buzz',glasses=1,pat='hoodie',prop='laptop',fx=fxs('code'),acc=('#c0cadc','#8a96b8','#5a6488')),
 'rubens':dict(skin='tan',tee=('#7ac060','#3a8a40','#1c5a2c'),pants=('#4a62a8','#2c3c78','#1a2050'),hair=('#5a3a28','#3a2418','#1c1008'),hairs='long',stache=1,pat='hoodie',prop='pipe',fx=fxs('smoke'),acc=('#c0cadc','#8a96b8','#5a6488')),
 'ze':dict(skin='brown',tee=('#fff0c8','#e0c898','#a8906c'),pants=('#7a5a3a','#4a3624','#2a1c10'),hair=('#2a1c18','#14100e','#08060a'),hairs='buzz',stache=1,pat='vest',drum=1,prop='stick',fx=fxs('notes'),acc=('#c83a3a','#8a2030','#5a1020')),
 'donnie':dict(skin='pale',tee=('#4a3a6a','#2a1c40','#140c24'),pants=('#2a2a38','#18181f','#0c0c10'),hair=('#2a2030','#14101c','#08060c'),hairs='long',beard=1,tats=1,pat='robe',prop='grim',fx=fxs('curse'),acc=('#6a3a98','#3a1c5a','#1c0c34')),
}
