(function () {
  try {
    if (typeof THREE === 'undefined') return;

    var canvas = document.getElementById('scene-canvas');
    if (!canvas) return;

    var isMobile = window.innerWidth < 900;

    var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0907, 0.04);

    var camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      140
    );
    camera.position.set(0, 5.2, 15);

    var renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: !isMobile
    });
    renderer.setClearColor(0x000000, 0);

    function applyQuality() {
      isMobile = window.innerWidth < 900;
      renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = !isMobile;
      if (renderer.shadowMap.enabled) {
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      }
    }
    applyQuality();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // ---------- Luces ----------
    var goldLight = 0xffb26b;
    var ambient = new THREE.HemisphereLight(0x3a2f22, 0x0a0705, 0.55);
    scene.add(ambient);

    var moonLight = new THREE.DirectionalLight(0x5a6a8a, 0.22);
    moonLight.position.set(-6, 10, -4);
    scene.add(moonLight);

    var rimLight = new THREE.DirectionalLight(0x3d4a66, 0.14);
    rimLight.position.set(6, 4, 10);
    scene.add(rimLight);

    // ---------- Materiales compartidos ----------
    var floorMat = new THREE.MeshStandardMaterial({ color: 0x14100c, roughness: 0.9, metalness: 0.05 });
    var woodMat = new THREE.MeshStandardMaterial({ color: 0x3a2a1c, roughness: 0.7, metalness: 0.05 });
    var darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x24170f, roughness: 0.75 });
    var ironMat = new THREE.MeshStandardMaterial({ color: 0x161412, roughness: 0.4, metalness: 0.7 });
    var goldMetalMat = new THREE.MeshStandardMaterial({ color: 0xC8A45A, roughness: 0.3, metalness: 0.65 });
    var glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, transparent: true, opacity: 0.16, roughness: 0.05, transmission: 0.65, metalness: 0
    });
    var leafMatA = new THREE.MeshStandardMaterial({ color: 0x2c3b22, roughness: 0.85 });
    var leafMatB = new THREE.MeshStandardMaterial({ color: 0x384a2a, roughness: 0.85 });
    var potMat = new THREE.MeshStandardMaterial({ color: 0x1c1512, roughness: 0.9 });
    var trunkMat = new THREE.MeshStandardMaterial({ color: 0x2a1c12, roughness: 0.85 });
    var emberMat = new THREE.MeshStandardMaterial({
      color: goldLight, emissive: goldLight, emissiveIntensity: 1.1, roughness: 0.4
    });
    var bottleMatWine = new THREE.MeshStandardMaterial({ color: 0x1c3d2a, roughness: 0.25, metalness: 0.25 });
    var bottleMatRed = new THREE.MeshStandardMaterial({ color: 0x3d1c1c, roughness: 0.25, metalness: 0.25 });
    var bottleMatAmber = new THREE.MeshStandardMaterial({ color: 0x6b3a12, roughness: 0.25, metalness: 0.2 });
    var lanternGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffe3b0, transparent: true, opacity: 0.5, transmission: 0.4, roughness: 0.15, emissive: 0x3a1f08, emissiveIntensity: 0.4
    });
    var moonMat = new THREE.MeshBasicMaterial({ color: 0xdfe6f2 });
    var moonHaloMat = new THREE.MeshBasicMaterial({ color: 0x8fa3c9, transparent: true, opacity: 0.12, side: THREE.BackSide });

    // ---------- Perfiles torneados (sustituyen los cilindros lisos) ----------
    function lathe(points, segments) {
      return new THREE.LatheGeometry(points.map(function (p) { return new THREE.Vector2(p[0], p[1]); }), segments || 12);
    }

    var bottleGeo = lathe([
      [0.001, 0], [0.075, 0], [0.075, 0.02], [0.07, 0.05], [0.07, 0.22],
      [0.05, 0.26], [0.025, 0.285], [0.022, 0.30], [0.022, 0.315], [0.027, 0.32]
    ], 12);

    var glassGeo = lathe([
      [0.09, 0], [0.09, 0.006], [0.02, 0.03], [0.016, 0.03], [0.016, 0.13],
      [0.02, 0.14], [0.05, 0.165], [0.062, 0.19], [0.065, 0.215], [0.06, 0.235], [0.05, 0.245]
    ], 10);

    var candleGeo = lathe([
      [0.055, 0], [0.055, 0.015], [0.018, 0.045], [0.018, 0.085],
      [0.04, 0.095], [0.045, 0.11], [0.028, 0.12]
    ], 10);

    var potGeo = lathe([
      [0.22, 0], [0.24, 0.02], [0.26, 0.05], [0.30, 0.38], [0.315, 0.40], [0.30, 0.42]
    ], 14);

    var lanternPoleGeo = lathe([
      [0.13, 0], [0.13, 0.05], [0.05, 0.10], [0.05, 2.85],
      [0.075, 2.90], [0.06, 2.95], [0.06, 3.0]
    ], 10);

    var tableLegGeo = lathe([
      [0.10, 0], [0.10, 0.03], [0.045, 0.09], [0.045, 0.55],
      [0.075, 0.62], [0.045, 0.70], [0.045, 0.92], [0.06, 0.95]
    ], 12);

    var chairLegGeo = lathe([
      [0.075, 0], [0.075, 0.02], [0.03, 0.06], [0.03, 0.46], [0.045, 0.50]
    ], 8);

    var tableTopGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.08, 24);
    var tableTrimGeo = new THREE.TorusGeometry(1.1, 0.015, 6, 24);
    var chairSeatGeo = new THREE.CylinderGeometry(0.26, 0.24, 0.045, 16);
    var chairBackGeo = new THREE.TorusGeometry(0.22, 0.014, 6, 16, Math.PI);
    var leafGeo = new THREE.IcosahedronGeometry(0.22, 0);
    var trunkGeo = new THREE.CylinderGeometry(0.05, 0.07, 0.5, 8);
    var lanternCageGeo = new THREE.BoxGeometry(0.26, 0.32, 0.26);
    var lanternCapGeo = new THREE.ConeGeometry(0.22, 0.22, 8);
    var lanternRingGeo = new THREE.TorusGeometry(0.16, 0.012, 6, 16);
    var railPostGeo = new THREE.CylinderGeometry(0.03, 0.035, 0.85, 8);
    var railBarGeo = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
    var glowPoolGeo = new THREE.CircleGeometry(0.9, 20);
    var barGlowPoolGeo = new THREE.CircleGeometry(2.6, 24);
    var glowPoolMat = new THREE.MeshBasicMaterial({ color: goldLight, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, depthWrite: false });

    var floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // ---------- Mesas ----------
    function makeTableSet(x, z, variant) {
      var group = new THREE.Group();

      var top = new THREE.Mesh(tableTopGeo, woodMat);
      top.position.y = 1.05;
      top.castShadow = true;
      top.receiveShadow = true;
      group.add(top);

      var trim = new THREE.Mesh(tableTrimGeo, goldMetalMat);
      trim.position.y = 1.09;
      trim.rotation.x = Math.PI / 2;
      group.add(trim);

      var leg = new THREE.Mesh(tableLegGeo, darkWoodMat);
      leg.position.y = 0.05;
      leg.castShadow = true;
      group.add(leg);

      var chairPositions = [[1.55, 0], [-1.55, 0], [0, 1.55], [0, -1.55]];
      chairPositions.forEach(function (p) {
        var chair = new THREE.Group();
        var seat = new THREE.Mesh(chairSeatGeo, woodMat);
        seat.position.y = 0.5;
        seat.castShadow = true;
        var back = new THREE.Mesh(chairBackGeo, ironMat);
        back.position.set(0, 0.78, -0.22);
        back.rotation.set(Math.PI / 2, 0, Math.PI);
        back.castShadow = true;
        var pedestal = new THREE.Mesh(chairLegGeo, ironMat);
        pedestal.position.y = 0;
        chair.add(seat, back, pedestal);
        chair.position.set(p[0], 0, p[1]);
        chair.lookAt(0, 0.5, 0);
        group.add(chair);
      });

      if (variant === 0) {
        var bottleMat = [bottleMatWine, bottleMatRed, bottleMatAmber][Math.floor(Math.random() * 3)];
        var bottle = new THREE.Mesh(bottleGeo, bottleMat);
        bottle.position.set(0.25, 1.09, 0.15);
        bottle.castShadow = true;
        group.add(bottle);

        for (var i = 0; i < 2; i++) {
          var glass = new THREE.Mesh(glassGeo, glassMat);
          glass.position.set(-0.2 + i * 0.3, 1.09, -0.2);
          group.add(glass);
        }
      } else {
        var mini = new THREE.Group();
        var miniPot = new THREE.Mesh(potGeo, potMat);
        miniPot.scale.setScalar(0.28);
        miniPot.position.y = 1.09;
        var miniLeaf = new THREE.Mesh(leafGeo, Math.random() > 0.5 ? leafMatA : leafMatB);
        miniLeaf.scale.set(0.22, 0.3, 0.22);
        miniLeaf.position.y = 1.24;
        mini.add(miniPot, miniLeaf);
        group.add(mini);
      }

      var candleHolder = new THREE.Mesh(candleGeo, goldMetalMat);
      candleHolder.position.set(0, 1.09, 0);
      group.add(candleHolder);
      var flame = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), emberMat);
      flame.position.set(0, 1.19, 0);
      group.add(flame);

      var flicker = new THREE.PointLight(goldLight, 0.7, 3.2, 2);
      flicker.position.set(0, 1.3, 0);
      group.add(flicker);
      group.userData.flame = flame;
      group.userData.light = flicker;

      var pool = new THREE.Mesh(glowPoolGeo, glowPoolMat);
      pool.rotation.x = -Math.PI / 2;
      pool.position.y = 0.01;
      group.add(pool);

      group.position.set(x, 0, z);
      return group;
    }

    var terraceGroup = new THREE.Group();
    var tablePositions = [
      [-5, -2], [-2, -1], [1, -2.5], [4, -1.5],
      [-4, 2], [0, 3], [4, 2.5], [-1.5, 5]
    ];
    var tables = tablePositions.map(function (p, i) {
      var t = makeTableSet(p[0], p[1], i % 2);
      terraceGroup.add(t);
      return t;
    });

    // ---------- Barra ----------
    var bar = new THREE.Group();
    var counter = new THREE.Mesh(new THREE.BoxGeometry(6, 1.1, 1.1), darkWoodMat);
    counter.position.set(0, 0.55, -9);
    counter.castShadow = true;
    counter.receiveShadow = true;
    bar.add(counter);

    for (var pnl = -2; pnl <= 2; pnl++) {
      var panel = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.85, 0.04), woodMat);
      panel.position.set(pnl * 1.05, 0.55, -8.44);
      bar.add(panel);
    }

    var counterTop = new THREE.Mesh(new THREE.BoxGeometry(6.15, 0.08, 1.2), goldMetalMat);
    counterTop.position.set(0, 1.13, -9);
    bar.add(counterTop);

    var barGlow = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.06, 0.06), emberMat);
    barGlow.position.set(0, 0.15, -9.5);
    bar.add(barGlow);

    var barLight = new THREE.PointLight(goldLight, 1.6, 8, 2);
    barLight.position.set(0, 1.6, -8.8);
    barLight.castShadow = !isMobile;
    bar.add(barLight);

    var shelfMats = [bottleMatWine, bottleMatRed, bottleMatAmber];
    for (var b = -3; b <= 3; b++) {
      var shelfBottle = new THREE.Mesh(bottleGeo, shelfMats[Math.abs(b) % 3]);
      shelfBottle.scale.setScalar(0.62);
      shelfBottle.position.set(b * 0.75, 1.32, -9.35);
      bar.add(shelfBottle);
    }

    var rackPlank = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.05, 0.3), darkWoodMat);
    rackPlank.position.set(0, 2.55, -9.1);
    bar.add(rackPlank);
    for (var g = -2; g <= 2; g++) {
      var hangGlass = new THREE.Mesh(glassGeo, glassMat);
      hangGlass.scale.setScalar(0.85);
      hangGlass.rotation.x = Math.PI;
      hangGlass.position.set(g * 0.5, 2.42, -9.1);
      bar.add(hangGlass);
    }

    var postL = new THREE.Mesh(lanternPoleGeo, darkWoodMat);
    postL.scale.set(1, 0.9, 1);
    postL.position.set(-3.4, 0, -9.3);
    var postR = postL.clone();
    postR.position.set(3.4, 0, -9.3);
    var beam = new THREE.Mesh(new THREE.BoxGeometry(7, 0.14, 0.14), darkWoodMat);
    beam.position.set(0, 2.7, -9.3);
    bar.add(postL, postR, beam);

    for (var pend = -1; pend <= 1; pend += 2) {
      var shade = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.14, 10, 1, true), goldMetalMat);
      shade.position.set(pend * 1.8, 2.35, -9.3);
      var pendLight = new THREE.PointLight(goldLight, 0.6, 3.5, 2);
      pendLight.position.set(pend * 1.8, 2.25, -9.3);
      bar.add(shade, pendLight);
    }

    var barPool = new THREE.Mesh(barGlowPoolGeo, glowPoolMat);
    barPool.rotation.x = -Math.PI / 2;
    barPool.position.set(0, 0.01, -9);
    bar.add(barPool);

    terraceGroup.add(bar);

    // ---------- Macetas ----------
    function makePlant(x, z, scale) {
      var group = new THREE.Group();
      var pot = new THREE.Mesh(potGeo, potMat);
      pot.scale.setScalar(0.9);
      pot.castShadow = true;
      group.add(pot);

      var trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.55;
      trunk.castShadow = true;
      group.add(trunk);

      for (var i = 0; i < 5; i++) {
        var leaf = new THREE.Mesh(leafGeo, i % 2 === 0 ? leafMatA : leafMatB);
        var ang = (i / 5) * Math.PI * 2;
        leaf.position.set(Math.cos(ang) * 0.28, 0.9 + Math.random() * 0.25, Math.sin(ang) * 0.28);
        leaf.scale.setScalar(0.55 + Math.random() * 0.25);
        leaf.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        leaf.castShadow = true;
        group.add(leaf);
      }
      var topLeaf = new THREE.Mesh(leafGeo, leafMatA);
      topLeaf.position.y = 1.15;
      topLeaf.scale.setScalar(0.6);
      group.add(topLeaf);

      group.position.set(x, 0, z);
      group.scale.setScalar(scale || 1);
      return group;
    }

    var plantPositions = [[-7, -6], [7, -6], [-7, 4], [7, 4], [-3, 7], [3, 7]];
    plantPositions.forEach(function (p) {
      terraceGroup.add(makePlant(p[0], p[1], 0.9 + Math.random() * 0.3));
    });

    // ---------- Farolas ----------
    function makeLanternPost(x, z) {
      var group = new THREE.Group();
      var pole = new THREE.Mesh(lanternPoleGeo, ironMat);
      pole.castShadow = true;
      group.add(pole);

      var cage = new THREE.Mesh(lanternCageGeo, lanternGlassMat);
      cage.position.y = 3.18;
      group.add(cage);

      var cap = new THREE.Mesh(lanternCapGeo, ironMat);
      cap.position.y = 3.44;
      group.add(cap);

      var ring = new THREE.Mesh(lanternRingGeo, goldMetalMat);
      ring.position.y = 3.02;
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

      var flame = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), emberMat);
      flame.position.y = 3.18;
      group.add(flame);

      var light = new THREE.PointLight(goldLight, 0.9, 5, 2);
      light.position.y = 3.18;
      group.add(light);
      group.userData.light = light;
      group.userData.lantern = cage;

      group.position.set(x, 0, z);
      return group;
    }

    var lanternPositions = [[-8, -3], [8, -3], [-8, 1], [8, 1], [-8, 6], [8, 6]];
    var lanterns = lanternPositions.map(function (p) {
      var l = makeLanternPost(p[0], p[1]);
      terraceGroup.add(l);
      return l;
    });

    // ---------- Barandilla perimetral ----------
    var railGroup = new THREE.Group();
    var railZ = 8.6;
    var railBalusters = isMobile ? 8 : 13;
    for (var rb = 0; rb < railBalusters; rb++) {
      var rx = -9 + (rb / (railBalusters - 1)) * 18;
      var post = new THREE.Mesh(railPostGeo, ironMat);
      post.position.set(rx, 0.42, railZ);
      railGroup.add(post);
    }
    var topRail = new THREE.Mesh(railBarGeo, goldMetalMat);
    topRail.scale.set(1, 18, 1);
    topRail.rotation.z = Math.PI / 2;
    topRail.position.set(0, 0.84, railZ);
    var lowRail = topRail.clone();
    lowRail.position.set(0, 0.5, railZ);
    railGroup.add(topRail, lowRail);
    terraceGroup.add(railGroup);

    // ---------- Guirnalda de luces ----------
    var stringLightGroup = new THREE.Group();
    var stringCount = isMobile ? 18 : 30;
    for (var s = 0; s < stringCount; s++) {
      var t = s / (stringCount - 1);
      var bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), emberMat);
      var xPos = -9 + t * 18;
      var sag = Math.sin(t * Math.PI) * 0.9;
      bulb.position.set(xPos, 4.6 - sag, -3 + (t < 0.5 ? t : (1 - t)) * -2);
      stringLightGroup.add(bulb);
    }
    var stringLight1 = new THREE.PointLight(goldLight, 0.5, 6, 2);
    stringLight1.position.set(-4, 4.3, -3);
    var stringLight2 = new THREE.PointLight(goldLight, 0.5, 6, 2);
    stringLight2.position.set(4, 4.3, -3);
    stringLightGroup.add(stringLight1, stringLight2);
    terraceGroup.add(stringLightGroup);

    scene.add(terraceGroup);

    // ---------- Cielo: estrellas y luna ----------
    var starCount = isMobile ? 90 : 180;
    var starPositions = new Float32Array(starCount * 3);
    for (var st = 0; st < starCount; st++) {
      var theta = Math.random() * Math.PI * 2;
      var phi = Math.random() * 0.55 + 0.05;
      var r = 55 + Math.random() * 20;
      starPositions[st * 3] = Math.cos(theta) * r * Math.cos(phi);
      starPositions[st * 3 + 1] = 8 + Math.sin(phi) * r * 0.6;
      starPositions[st * 3 + 2] = Math.sin(theta) * r * Math.cos(phi) - 10;
    }
    var starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    var starMat = new THREE.PointsMaterial({ color: 0xdfe6f2, size: 0.18, transparent: true, opacity: 0.8, sizeAttenuation: true });
    var stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    var moon = new THREE.Mesh(new THREE.SphereGeometry(1.4, 20, 20), moonMat);
    moon.position.set(-16, 20, -30);
    scene.add(moon);
    var moonHalo = new THREE.Mesh(new THREE.SphereGeometry(2.4, 16, 16), moonHaloMat);
    moonHalo.position.copy(moon.position);
    scene.add(moonHalo);

    // ---------- Brasas flotantes ----------
    var emberCount = isMobile ? 24 : 48;
    var emberPositions = new Float32Array(emberCount * 3);
    var emberSpeeds = new Float32Array(emberCount);
    for (var e = 0; e < emberCount; e++) {
      emberPositions[e * 3] = (Math.random() - 0.5) * 20;
      emberPositions[e * 3 + 1] = Math.random() * 4;
      emberPositions[e * 3 + 2] = (Math.random() - 0.5) * 16 - 2;
      emberSpeeds[e] = 0.15 + Math.random() * 0.25;
    }
    var emberGeo = new THREE.BufferGeometry();
    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));
    var emberPointsMat = new THREE.PointsMaterial({
      color: goldLight, size: 0.045, transparent: true, opacity: 0.75,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    var emberPoints = new THREE.Points(emberGeo, emberPointsMat);
    scene.add(emberPoints);

    // ---------- Cámara guiada por scroll ----------
    var clock = new THREE.Clock();
    var camTargets = [
      { pos: new THREE.Vector3(0, 5.2, 15), look: new THREE.Vector3(0, 1.4, -3) },
      { pos: new THREE.Vector3(-4, 3.6, 6), look: new THREE.Vector3(0, 1.6, -6) },
      { pos: new THREE.Vector3(4, 2.8, -1), look: new THREE.Vector3(0, 1.8, -9) },
      { pos: new THREE.Vector3(0, 2.2, -6), look: new THREE.Vector3(0, 1.6, -12) }
    ];
    var scrollProgress = 0;
    var currentLook = camTargets[0].look.clone();

    function lerp(a, b, n) {
      return a + (b - a) * n;
    }

    function updateScrollProgress() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      scrollProgress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    }
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    function getSegmentTarget(progress) {
      var segments = camTargets.length - 1;
      var scaled = progress * segments;
      var idx = Math.min(Math.floor(scaled), segments - 1);
      var localT = scaled - idx;
      var a = camTargets[idx];
      var bTarget = camTargets[idx + 1];
      return {
        pos: new THREE.Vector3().lerpVectors(a.pos, bTarget.pos, localT),
        look: new THREE.Vector3().lerpVectors(a.look, bTarget.look, localT)
      };
    }

    function animate() {
      requestAnimationFrame(animate);
      var elapsed = clock.getElapsedTime();

      tables.forEach(function (t, i) {
        var flicker = 0.6 + Math.sin(elapsed * 3 + i) * 0.15 + Math.sin(elapsed * 7 + i * 2) * 0.05;
        t.userData.light.intensity = Math.max(flicker, 0.3);
      });

      lanterns.forEach(function (l, i) {
        var flicker = 0.75 + Math.sin(elapsed * 2.2 + i * 1.3) * 0.2;
        l.userData.light.intensity = Math.max(flicker, 0.4);
        l.userData.lantern.rotation.y = Math.sin(elapsed * 0.4 + i) * 0.02;
      });

      var emberPos = emberGeo.attributes.position;
      for (var ei = 0; ei < emberCount; ei++) {
        var y = emberPos.getY(ei) + emberSpeeds[ei] * 0.016;
        if (y > 4.5) y = 0;
        emberPos.setY(ei, y);
      }
      emberPos.needsUpdate = true;

      var target = getSegmentTarget(scrollProgress);
      camera.position.x = lerp(camera.position.x, target.pos.x, 0.04);
      camera.position.y = lerp(camera.position.y, target.pos.y, 0.04);
      camera.position.z = lerp(camera.position.z, target.pos.z, 0.04);
      currentLook.x = lerp(currentLook.x, target.look.x, 0.04);
      currentLook.y = lerp(currentLook.y, target.look.y, 0.04);
      currentLook.z = lerp(currentLook.z, target.look.z, 0.04);
      camera.lookAt(currentLook);

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      applyQuality();
    });
  } catch (err) {
    if (window && window.console) {
      console.warn('La escena 3D no pudo iniciarse. El sitio continúa funcionando con normalidad.', err);
    }
  }
})();
