    let scene, camera, renderer, aLight, pLight, rayCast, mouse;

    let current = document.getElementById("score_id");

   
    let getRandom = function (min, max) {
        let random = Math.random() * (max - min) + min;
        return random;
    }

  
    const colorList = [0x4deae3, 0xf12a38, 0xffcb3a, 
                        0xfffc02, 0x6eed18, 0x5698ff, 
                        0x9da8fff, 0x9f076e, 0x9f40d9];

    let minArea = -30;
    let maxArea = 30;

    let cube;
 
    let createCube = function () {
        const color = colorList[Math.floor(getRandom(0, 9))];
        let geometry = new THREE.BoxGeometry(3, 3, 3);
        let material = new THREE.MeshPhongMaterial({
                        color: color,
        });
        cube = new THREE.Mesh(geometry, material);
        let x = getRandom(minArea, maxArea);
        let y = getRandom(minArea, maxArea);
        let z = getRandom(minArea, maxArea);
        cube.position.set(x, y, z);
        scene.add(cube);
    }

    let disposed = function (obj) {
        obj.geometry.dispose();
        obj.material.dispose();
        scene.remove(obj);
        renderer.renderLists.dispose();
    }

    let score = 0;
    let selected = [];
    let original = [];

    let calculate_score = function () {
        if (selected[0].material.color.getHex() === selected[1].material.color.getHex()) {
            selected.forEach(object => {
                disposed(object);
            });
            score += 1;
        }
        else {
            score -= 1;
        }
        current.innerHTML = score;
        original.length = 0;
        selected.length = 0;
    }

    let onMouseClick = function (e) {
        clicked = 0;
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
        rayCast.setFromCamera(mouse, camera);

        let intersects = rayCast.intersectObjects(scene.children, false);

        if (intersects[0]) {
            let firstObject = intersects[0].object;
            if (selected.length > 0) {
                if (firstObject.uuid === selected[0].uuid) {
                    firstObject.material.emissive.setHex(0x000000);
                    selected = [];
                    originalColors = [];
                    return;
                }
            }

            selected.push(firstObject);
            original.push(firstObject.material.color.getHex());
            if (selected.length > 1) {
                calculate_score();
            }

            if (selected.length == 1) {
                if (clicked == 1) {
                    selected.pop(firstObject);
                    original.pop(firstObject.material.color.getHex());
                }
                clicked = 1;
            }
        }
    }

    // set up the environment 
    // initiallize scene, camera, objects and renderer
    let init = function () {
        // 1. create the scene
        scene = new THREE.Scene();
        const Texture = new THREE.TextureLoader().load('./galaxy.jpg');
        scene.background = Texture;

        // 2. create an locate the camera       
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,
                1, 1000);
        camera.position.set(0, 0, 50);

        aLight = new THREE.AmbientLight(0xffffff, 1);
        pLight = new THREE.PointLight(0xffffff, 1);
        pLight.position.set(0, 0, 0);
        scene.add(aLight);
        scene.add(pLight);

        rayCast = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        mouse.x = mouse.y = -1;

        // 3. create an locate the object on the scene          
        for(let i = 0; i < 30; i++){
            createCube();
        }

        // 4. create the renderer     
        document.addEventListener("click", onMouseClick);
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);

        renderer.render(scene, camera, controls);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    let clock = new THREE.Clock();

    let flag = 0;
    let speed = 0.02;
    let base = 0.02;
    
    let mainLoop = function () {
        if (scene.children.length >= 30) {
            flag = 0;
            speed = base;
            current.innerHTML = score;
        } 
        else {
            flag += speed;
        }
        if (flag > 1) {
            createCube();
            flag = 0;
            speed += 0.002;

        }
      
        const elapsedTime = clock.getElapsedTime();

        if (selected.length > 0) {
            selected[0].material.emissive.setHex(elapsedTime % 0.5 >= 0.25 ? original[0] : 0x000000);
        }

        renderer.render(scene, camera);
        requestAnimationFrame(mainLoop);
    };

    ///////////////////////////////////////////////
    init();
    mainLoop();


    document.getElementById("btn_id").addEventListener("click", function () {
        location.reload();
    });