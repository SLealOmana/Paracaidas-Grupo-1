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
//Coloca recuadro blanco a la grafica
var canvas = document.getElementById('canvas_1'),//Canvas o graficas
ctx = canvas.getContext('2d');//Dimensiones de la grafica
ctx.font = '13px Helvetica';
var wChar= ctx.measureText('m').width;
gravedad = 9.8;//valor de la gravedad inicial
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
    dt=parseFloat(document.getElementById('intervalos').value), 
	t=0,
//posición y velocidad
    x=0, 
	v=0, 
	a=gravedad, 
	x0, 
	v0= 0, 
	t0,
//Densidad Aire
  densidadAire = densidad(AlturaMaxima);
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
//FUncion de la grafica 
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
//Se encarga de mover la partuicula o paracaidas
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
//Es la del cuerpo libre
function muestraValores(g){
	g.textAlign='left';
	g.textBaseline='top';
    g.fillStyle='lightBlue';
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
//El recuadro azul claro que muestra los valores
 function dispositivo(g){
//ejes
    grafica(g);
//gráfica v-t
   mueveParticula(g);
   muestraValores(g);
  }
//auxuliar
	
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

    dt=parseFloat(document.getElementById('intervalos').value),
    m=parseFloat(document.getElementById('masa_1').value);
   	area=parseFloat(document.getElementById('area_1').value);
    xInicial = 0;
    coheficienteDeForma = parseFloat(document.getElementById('forma').value);
    densidadAire = densidad(AlturaMaxima);   
	  k=densidadAire*area*coheficienteDeForma/2;
    Vl=Math.sqrt(gravedad*m/k);
    t=0.0;
    V0 = 0;
    xMax = AlturaMaxima;
    x=xMax-xInicial; 
    x_1 = x;  
    v=0;
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
//Boton para abrir un nuevo ejemplo
abre.onclick = function (e) {	
   abre.disabled=true;
   caida=1;
    t0=t;
    v0=gravedad*t;
    x0=gravedad*t*t/2;
}
//Boton para abrir el paracaidas
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
//boton para empezar el programa
pausa.onclick = function (e) {
  empieza.disabled=false;
    pausa.disabled=true;
	paso.style.display='inline';
	pausa.style.display='none';
    window.cancelAnimationFrame(raf);
}
//Boton para pausar el programa
paso.onclick = function (e) {
    update();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawGrid('lightgray', 10, 10);  
    dispositivo(ctx);
}
//boton para avanzar mas lentamente
function update() {    
    switch(caida){
        case 0:        //libre antes de la apertura del paracaidsa
            a=gravedad;
            v=gravedad*t + V0;
            x=gravedad*t*t/2;
            break;
        case 1:        //Al momento de abrir el paracaidas
            // Las formulas estan explicadas en el pdf
            var c=(v0+Vl)*Math.exp(Math.sqrt(gravedad*k/m)*(t-t0));
            var d=(v0-Vl)*Math.exp(-Math.sqrt(gravedad*k/m)*(t-t0));
            v=Vl*(c+d)/(c-d) + V0;//Velociad usando limite
            a=gravedad-k*v*v/m;//Aceleracion
            x=x0-m*Math.log((Vl*Vl-v*v)/(Vl*Vl-v0*v0))/(2*k);//Posicion
            alturaActual = AlturaMaxima-x;//Altura actual usada para 
            densidadAire = densidad(alturaActual); //Calculo de la densidad actual
	          k=densidadAire*area*coheficienteDeForma/2;// Calculo de K en la pos Actual
            
            if(Math.abs(v-Vl)<0.000001){
                caida=2;
                x0=x;
                v=Vl;
                t0=t;
            }//Cuando se alcanza la velocidad limite y se pasa de estar desacelrando a avanzar constante 
            break;
        case 2:   //movimiento uniforme
            a=0.0;
            x=x0+Vl*(t-t0);//Formula velocidad terminal cuando ya no puede ir mas rapido
            break;
        default:
            break;
    }
    t+=dt;//Actualizacion del tiempo en el intervalo establecido  
}
//Update actualiza los datos en el intervalo de tiempo establecido
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
//Animate es solo visual, anima respecto al tiempo 
function densidad(altura)
  {
    densidadAire=0;
    alturasPosibles = [0,100,200,500,1000,2000,3000,4000,5000,7500];
    densidadesPosibles = [1.225,1.213,1.202,1.167,1.112,1.007,0.909,0.819,0.736,0.557];
    if(altura>alturasPosibles[0]&&altura<=alturasPosibles[1])
    {
      densidadAire = densidadesPosibles[0];
    }
    if(altura>alturasPosibles[1]&&altura<=alturasPosibles[2])
    {
      densidadAire = densidadesPosibles[1];
    }
    if(altura>alturasPosibles[2]&&altura<=alturasPosibles[3])
    {
      densidadAire = densidadesPosibles[2];
    }
    if(altura>alturasPosibles[3]&&altura<=alturasPosibles[4])
    {
      densidadAire = densidadesPosibles[0];
    }
    if(altura>alturasPosibles[4]&&altura<=alturasPosibles[5])
    {
      densidadAire = densidadesPosibles[1];
    }
    if(altura>alturasPosibles[5]&&altura<=alturasPosibles[6])
    {
      densidadAire = densidadesPosibles[2];
    }
    if (altura<=alturasPosibles[7]&&altura>alturasPosibles[6])
    {
      densidadAire = densidadesPosibles[7];
    }
    if (altura<=alturasPosibles[8]&&altura>alturasPosibles[7])
    {
      densidadAire = densidadesPosibles[8];
    } 
    if (altura<=alturasPosibles[9]&&altura>alturasPosibles[8])
    {
      densidadAire = densidadesPosibles[9];
    }
    return densidadAire;
  }
//Funcion auxiliar creada para la variacion de densidad respecto a la altura