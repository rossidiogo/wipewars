import numpy as np
RAMPS={
'skin':['#8a5260','#bc7468','#e49e72','#fcd0a0'],
'stubble':['#5a3a46','#7a5058','#9a6c68','#bb8c7c'],
'beard':['#1a1226','#2c2036','#4a3a58','#6a5a7a'],
'hat':['#5a3340','#8a5a40','#bf8a4e','#f0c078'],
'teal':['#1c2e4c','#2c5470','#4a86a0','#86c0cc'],
'vest':['#3c2230','#5c3a38','#8a5a3c','#c08850'],
'red':['#6a1c34','#a02a3c','#d84a3c','#ff8a6a'],
'cream':['#7a6a7a','#b8a898','#e8d8b8','#fff4d8'],
'jeans':['#1a2050','#2c3c78','#4a62a8','#7a96d4'],
'boot':['#3a2030','#623448','#9a5a38','#d08850'],
'gold':['#6a3a1c','#b87a14','#f0bc3a','#fff0a0'],
'dark':['#160c1c','#241420','#3a2230','#5a3a48'],
'lens':['#6a8aa8','#a8c8dc','#d8eefa','#ffffff'],
'ash':['#3a3848','#6a6a7e','#9a9aae','#cfcfe0'],
'yel':['#a06a14','#d8a420','#f8d83a','#fff2a0'],
'orn':['#8a2c1c','#c8501c','#f07828','#ffa858'],
'robe':['#2a1450','#4a2a98','#7048d0','#a888f8'],
'hair':['#1c0e18','#3c2024','#6a3c34','#9a6448'],
'white':['#8a8aa8','#c0c0d8','#ececf8','#ffffff'],
'grn':['#1c4a2c','#2c7a3c','#4aa84a','#9ae070'],
'cry':['#1c4a7c','#2c88c0','#5ad0e8','#d8f8ff'],
'ice':['#1c3a6a','#3c78b8','#86c8ec','#e8f8ff'],
'ice2':['#2c1c5a','#5a3c9a','#9a86d8','#e0d8ff'],
'frost':['#a0b8d8','#c8dcf0','#e8f4ff','#ffffff'],
'tee':['#1c2a5a','#2c4a9a','#4a78d8','#8ab4ff'],
'grit':['#7a4a28','#b87c40','#e0b068','#f8e0a0'],
'crust':['#3a1c14','#8a4a24','#d08a3c','#f0c068'],
'char':['#14100e','#2a1c18','#4a3028','#7a5a40'],
'chz':['#b87a14','#f0bc3a','#ffe070','#fff4b0'],
'smoke':['#4a4a5a','#7a7a8e','#aaaabc','#d8d8e8'],
'olive':['#7a4e3a','#a87a52','#d0a470','#ecc896'],
'silver':['#5a6488','#8a96b8','#c0cadc','#ffffff'],
}
def hx(c): return np.array([int(c[i:i+2],16) for i in (1,3,5)],np.float32)
PAL=np.array([hx(c) for r in RAMPS.values() for c in r])
def lab(rgb):
    c=rgb/255.0
    c=np.where(c>0.04045,((c+0.055)/1.055)**2.4,c/12.92)
    M=np.array([[0.4124,0.3576,0.1805],[0.2126,0.7152,0.0722],[0.0193,0.1192,0.9505]])
    xyz=c@M.T/np.array([0.95047,1,1.08883])
    f=np.where(xyz>0.008856,np.cbrt(xyz),7.787*xyz+16/116)
    return np.stack([116*f[...,1]-16,500*(f[...,0]-f[...,1]),200*(f[...,1]-f[...,2])],-1)
PLAB=lab(PAL)
def snap(rgb01):
    h,w,_=rgb01.shape
    L=lab(rgb01.reshape(-1,3)*255)
    d=((L[:,None,:]-PLAB[None])**2)
    d[...,0]*=1.0
    return PAL[d.sum(-1).argmin(1)].reshape(h,w,3).astype(np.uint8)
