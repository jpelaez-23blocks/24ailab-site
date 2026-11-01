// FM story: light 3D globe (brand colors from the site's globe), lazy-loaded.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js';

const D = Math.PI / 180;
function v3(lat, lng, r) {
  const phi = (90 - lat) * D, th = (lng + 180) * D;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
}

export function createGlobe(canvas, pts) {
  const ren = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  ren.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  ren.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  // silhouette radius = 250/320 of the half-height, matching the ring it grows out of
  const t = (250 / 320) * Math.tan(15 * D);
  cam.position.set(0, 0, 1 / Math.sin(Math.atan(t)));
  const g = new THREE.Group(); g.rotation.order = 'XYZ'; scene.add(g);

  g.add(new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), new THREE.MeshPhongMaterial({ color: 0xe8f2fc, shininess: 4, specular: 0x223344 })));
  scene.add(new THREE.AmbientLight(0xffffff, 2.3));
  const dl = new THREE.DirectionalLight(0xffffff, 1.1); dl.position.set(-2, 1.6, 3); scene.add(dl);

  // atmosphere: soft fresnel rim in #9cc9ff (same hue as the site's globe)
  const atm = new THREE.Mesh(new THREE.SphereGeometry(1.1, 64, 48), new THREE.ShaderMaterial({
    side: THREE.BackSide, transparent: true, depthWrite: false,
    uniforms: { c: { value: new THREE.Color(0x9cc9ff) } },
    vertexShader: 'varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'uniform vec3 c;varying vec3 n;void main(){float d=clamp(-dot(n,vec3(0,0,1.))*2.4,0.,1.);gl_FragColor=vec4(c,d*d*.75);}'
  }));
  scene.add(atm);

  // station points
  const pos = new Float32Array(pts.length / 2 * 3);
  for (let i = 0, j = 0; i < pts.length; i += 2, j += 3) { const p = v3(pts[i] / 10, pts[i + 1] / 10, 1.004); pos[j] = p.x; pos[j + 1] = p.y; pos[j + 2] = p.z; }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const sc = document.createElement('canvas'); sc.width = sc.height = 32; const cx = sc.getContext('2d');
  const gr = cx.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.55, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  cx.fillStyle = gr; cx.fillRect(0, 0, 32, 32);
  const pm = new THREE.PointsMaterial({ color: 0x1a6fd6, size: 0.026, sizeAttenuation: true, map: new THREE.CanvasTexture(sc), transparent: true, opacity: 0, depthWrite: false });
  g.add(new THREE.Points(pg, pm));

  // country outlines (same Natural Earth file the site already ships)
  fetch('/countries.geojson').then(r => r.json()).then(geo => {
    const a = [];
    const ring = rr => { for (let i = 1; i < rr.length; i++) { const p = v3(rr[i - 1][1], rr[i - 1][0], 1.0015), q = v3(rr[i][1], rr[i][0], 1.0015); a.push(p.x, p.y, p.z, q.x, q.y, q.z); } };
    for (const f of geo.features) { const gm = f.geometry; if (!gm) continue;
      if (gm.type === 'Polygon') gm.coordinates.forEach(ring); else if (gm.type === 'MultiPolygon') gm.coordinates.forEach(pp => pp.forEach(ring)); }
    const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(a, 3));
    g.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0xa9bdd3, transparent: true, opacity: .9 })));
  }).catch(() => {});

  let W = 1, H = 1;
  const tmp = new THREE.Vector3(), rel = new THREE.Vector3();
  return {
    resize(w, h) { W = w; H = h; ren.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); },
    render(lngC, latC, ptsAlpha) {
      g.rotation.set(latC * D, (-90 - lngC) * D, 0); g.updateMatrixWorld();
      pm.opacity = ptsAlpha; ren.render(scene, cam);
    },
    project(lat, lng) {
      tmp.copy(v3(lat, lng, 1.01)).applyMatrix4(g.matrixWorld);
      rel.copy(cam.position).sub(tmp); const facing = tmp.dot(rel) / (tmp.length() * rel.length());
      tmp.project(cam);
      return [(tmp.x + 1) / 2 * W, (1 - tmp.y) / 2 * H, facing];
    }
  };
}
