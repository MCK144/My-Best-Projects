// TextureCache is static
class TextureCache {
	static cache = {}

	static getTexture(texturePath){
		
		for (let key in this.cache){
			//return the texture of the specified path if it has already been created
			if (key == texturePath){
				return this.cache[key];
			}
		}
		//create a new texture and add it to the path
		this.cache[texturePath] = new Image();
		this.cache[texturePath].src = texturePath;

		return this.cache[texturePath];
	}
}


export {TextureCache};