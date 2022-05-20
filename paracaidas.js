function drawGrid(color, stepx, stepy) {
   ctx.save()
   ctx.strokeStyle = 'white';
   ctx.fillStyle = '#ffffff';
   ctx.lineWidth = 0.5;
   ctx.fillRect(0, 0, canvas.width, canvas.height);

   for (var i = stepx + 0.5; i < canvas.width; i += stepx) {
     ctx.beginPath();
     ctx.moveTo(i, 0);
     ctx.lineTo(i, canvas.height);
     ctx.stroke();
   }

   for (var i = stepy + 0.5; i < canvas.height; i += stepy) {
     ctx.beginPath();
     ctx.moveTo(0, i);
     ctx.lineTo(canvas.width, i);
     ctx.stroke();
   }
   ctx.restore();
}

var canvas = document.getElementById('canvas_1'),
ctx = canvas.getContext('2d');
ctx.font = '13px Helvetica';
var wChar= ctx.measureText('m').width;
gravedad = 9.8;
AlturaMaxima = parseFloat(document.getElementById('AlturaMaxima').value);
var orgX=5*wChar, 
orgY=canvas.height-2*wChar, 
orgXX=13*wChar,
//escalas
  escalaX=(canvas.width-orgXX)/100, 
	escalaYY=orgY/(AlturaMaxima/10), 
	escalaY=(canvas.height-wChar)/AlturaMaxima,
//parámetros del movimiento
    k,
//velocidad límite
    Vl, 
	V0,
//peso del paracaidista
    m,
//tiempo
    dt=0.1, 
	t=0,
//posición y velocidad
    x=0, 
	v=parseFloat(document.getElementById('velI').value), 
	a=gravedad, 
	x0, 
	v0= parseFloat(document.getElementById('velI').value), 
	t0,
//Altura maxima
 
//condiciones de caída
    caida=0,        //0 es libre, 1 con rozamiento, 2 en el límite
	pol=[], //gráfica
	flecha=[];


function grafica(g){
    var x1, y1;
//eje horizontal
    g.strokeStyle='black';
    g.fillStyle='black';
	g.textAlign='center';
	g.textBaseline='top';
	g.beginPath();
    g.moveTo(orgXX, orgY);
	g.lineTo(canvas.width, orgY);
    for(var i=10; i<100; i+=10){
        x1=orgXX+escalaX*i;
        g.fillText(i, x1, orgY+wChar-2);
        g.moveTo(x1, orgY+wChar);
		g.lineTo(x1, orgY);
    }
    g.fillText('t(s)', canvas.width-2*wChar, orgY+2);
//eje vertical
 	g.textAlign='right';
	g.textBaseline='middle';
    g.moveTo(orgXX, 0);
	g.lineTo(orgXX, canvas.height);
    g.fillText('v(m/s)', orgXX-wChar/2, wChar);
    for(var i=0; i<(AlturaMaxima/10); i+=20){
        y1=orgY-escalaYY*i;
        g.fillText(i, orgXX-wChar, y1);
        g.moveTo(orgXX-wChar, y1);
		g.lineTo(orgXX, y1);
        y1=orgY-escalaYY*(i+10);
        g.moveTo(orgXX-wChar/2, y1);
		g.lineTo(orgXX, y1);
    }
//eje vertical de la animación
    g.moveTo(orgX, 0);
	g.lineTo(orgX,canvas.height);
    g.fillText('x(m)', orgX+3*wChar, wChar);
    for(var i=(AlturaMaxima/10); i<=AlturaMaxima; i+=(AlturaMaxima/10)){
        y1=canvas.height-escalaY*i;
        g.fillText(i, orgX-wChar, y1);
        g.moveTo(orgX-wChar, y1);
		g.lineTo(orgX, y1);
        y1=canvas.height-escalaY*(i-100);
        g.moveTo(orgX-wChar/2, y1);
		g.lineTo(orgX, y1);
    }
	g.stroke();
    y1=orgY-v*escalaYY;
    x1=orgXX+t*escalaX;
    pol.push({x:x1, y:y1});
	
	g.save();
	g.setLineDash([5]);
	g.beginPath();
	g.moveTo(x1,y1);
	g.lineTo(x1,orgY);
	g.moveTo(x1,y1);
	g.lineTo(orgXX,y1);
	g.stroke();
	g.restore();
   
    g.strokeStyle='blue';
	g.beginPath();
	g.moveTo(pol[0].x,pol[0].y);
	for(var i=1; i<pol.length; i++){
		g.lineTo(pol[i].x,pol[i].y);	
	}
	g.stroke();
}
   
  function mueveParticula(g){
    var y1=canvas.height-(AlturaMaxima-x)*escalaY;
    g.fillStyle='green';
    console.log(g.type)
	g.beginPath();
    g.arc(orgX+wChar, y1, wChar/2, 0, 2*Math.PI);
	g.fill();
    flechaFuerza(g, orgX+3*wChar, y1, 'red', -1, gravedad);
    if(caida==1 || caida==2){
        g.strokeStyle='blue';
		g.beginPath();
        g.arc(orgX+wChar, y1, wChar, 0, Math.PI, true);
		g.lineTo(orgX+wChar, y1+wChar);
		g.lineTo(orgX+2*wChar, y1);
		g.stroke();
        flechaFuerza(g, orgX+3*wChar, y1, 'blue', 1, k*v*v/m);
    }
  }
  
 function flechaFuerza(g, x2, y2, color, sgn, f0){
//longitud
    var lon=sgn*f0*2*wChar/gravedad;
    if(Math.abs(lon)<1) return;
    flecha.length=0;
    flecha.push({x:x2+2, y:y2});
    flecha.push({x:x2+2, y:y2-lon});
    flecha.push({x:x2+4, y:y2-lon});
    flecha.push({x:x2, y:y2-lon-4*sgn});
	flecha.push({x:x2-4, y:y2-lon});
    flecha.push({x:x2-2, y:y2-lon});
    flecha.push({x:x2-2, y:y2});
//color rojo
    g.fillStyle=color;
	g.beginPath();
	g.moveTo(flecha[0].x,flecha[0].y);
	for(var i=1; i<flecha.length; i++){
		g.lineTo(flecha[i].x,flecha[i].y);	
	}
	g.closePath();
    g.fill();
}

function muestraValores(g){
	g.textAlign='left';
	g.textBaseline='top';
    g.fillStyle='cyan';
    g.fillRect(orgXX+8*wChar, 0, canvas.width-orgXX-4*wChar, 2*wChar);
    g.fillStyle='black';
//tiempo
    var x1=orgXX+10*wChar;
    g.fillText('t: '+t.toFixed(1), x1, 2);
//posición
    if(x>AlturaMaxima){
        x=AlturaMaxima;
    }
    x1+=(canvas.width-orgXX-10*wChar)/4;
    g.fillText('x: '+(AlturaMaxima-x).toFixed(1), x1, 2);
//velocidad
    x1+=(canvas.width-orgXX-10*wChar)/4;
    g.fillText('v: '+(-v).toFixed(1), x1, 2);
 //aceleración
    x1+=(canvas.width-orgXX-10*wChar)/4;
    g.fillText('a: '+(-a).toFixed(1), x1, 2);
  }
  
 function dispositivo(g){
//ejes
    grafica(g);
//gráfica v-t
   mueveParticula(g);
   muestraValores(g);
  }

	
var raf, 
	nuevo = document.getElementById('nuevo'),
	empieza = document.getElementById('empieza'),
	abre = document.getElementById('abre'),
  paso = document.getElementById('paso'),
	pausa=document.getElementById('pausa');

drawGrid('lightgray', 10, 10);  
dispositivo(ctx);
empieza.disabled=true;
pausa.disabled=true;
abre.disabled=true;


nuevo.onclick = function (e) {
    gravedad = parseFloat(document.getElementById('gravedad').value);
    AlturaMaxima = parseFloat(document.getElementById('AlturaMaxima').value);
   	canvas = document.getElementById('canvas_1'),
    ctx = canvas.getContext('2d');
    ctx.font = '13px Helvetica';
    wChar= ctx.measureText('m').width;
  
    orgX=5*wChar, 
    orgY=canvas.height-2*wChar, 
    orgXX=13*wChar,
  escalaX=(canvas.width-orgXX)/100, 
	escalaYY=orgY/(AlturaMaxima/10), 
	escalaY=(canvas.height-wChar)/AlturaMaxima;

  
  m=parseFloat(document.getElementById('masa_1').value);
   	var area=parseFloat(document.getElementById('area_1').value);
    xInicial = 0;
	  k=1.29*area*0.8/2;
    Vl=Math.sqrt(gravedad*m/k);
    t=0.0;
    V0 = parseFloat(document.getElementById('velI').value);
    xMax = AlturaMaxima;
    x=xMax-xInicial;         //2000 m
    x_1 = x;  
    v=parseFloat(document.getElementById('velI').value);
    a=gravedad;
	caida=0;
	pol.length=0;
 
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawGrid('lightgray', 10, 10);  
    dispositivo(ctx);
    empieza.disabled=false;
    abre.disabled=true;
    pausa.disabled=true;
	paso.style.display='none';
	pausa.style.display='inline';
	if(raf!=undefined){
        window.cancelAnimationFrame(raf);
    }
}

abre.onclick = function (e) {	
   abre.disabled=true;
   caida=1;
    t0=t;
    v0=gravedad*t;
    x0=gravedad*t*t/2;
}

empieza.onclick = function (e) {
  if(caida==0){
        abre.disabled=false;
  }
   empieza.disabled=true;
    pausa.disabled=false;
	paso.style.display='none';
	pausa.style.display='inline';
	raf=window.requestAnimationFrame(animate);
}

pausa.onclick = function (e) {
  empieza.disabled=false;
    pausa.disabled=true;
	paso.style.display='inline';
	pausa.style.display='none';
    window.cancelAnimationFrame(raf);
}
paso.onclick = function (e) {
    update();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawGrid('lightgray', 10, 10);  
    dispositivo(ctx);
}
function update() {
    switch(caida){ 
        case 0:        //libre antes de la apertura del paracaidsa
            a=gravedad;
            v=gravedad*t + V0;
            x=gravedad*t*t/2;
            break;
        case 1:             //Al momento de abrir el paracaidas
            var c=(v0+Vl)*Math.exp(Math.sqrt(gravedad*k/m)*(t-t0));
            var d=(v0-Vl)*Math.exp(-Math.sqrt(gravedad*k/m)*(t-t0));
            v=Vl*(c+d)/(c-d) + V0;
            a=gravedad-k*v*v/m;
            x=x0-m*Math.log((Vl*Vl-v*v)/(Vl*Vl-v0*v0))/(2*k);
            if(Math.abs(v-Vl)<0.001){
                caida=2;
                x0=x;
                v=Vl;
                t0=t;
            }
            break;
        case 2:   //movimiento uniforme
            a=0.0;
            x=x0+Vl*(t-t0);
            break;
        default:
            break;
    }
    t+=dt;  
}

function animate(time) {
   update();
	if (x>x_1){
       window.cancelAnimationFrame(raf);
        pausa.disabled=true;
 	}else{
        raf=window.requestAnimationFrame(animate);
    }
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawGrid('lightgray', 10, 10);  
    dispositivo(ctx);
}