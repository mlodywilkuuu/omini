import { LoadingManager } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { LoadingManager, TextureLoader } from 'three';
import type { Texture } from 'three';

export class AssetManager {
  readonly loading = new LoadingManager();
  private readonly models = new Map<string, Promise<GLTF>>();
  private readonly textures = new Map<string, Promise<Texture>>();
  private readonly gltf = new GLTFLoader(this.loading);
  private readonly textureLoader = new TextureLoader(this.loading);

  loadModel(url: string): Promise<GLTF> {
    let asset = this.models.get(url);
    if (!asset) {
      asset = this.gltf.loadAsync(url);
      this.models.set(url, asset);
      asset.catch(() => this.models.delete(url));
    }
    return asset;
  }

  loadTexture(url: string): Promise<Texture> {
    let asset = this.textures.get(url);
    if (!asset) {
      asset = this.textureLoader.loadAsync(url);
      this.textures.set(url, asset);
      asset.catch(() => this.textures.delete(url));
    }
    return asset;
  }

  clear(): void {
    for (const promise of this.textures.values()) {
      void promise.then(texture => texture.dispose()).catch(() => undefined);
    }
    this.models.clear();
    this.textures.clear();
  }
}
