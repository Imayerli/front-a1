/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/

// Array de palos
var palos = ["viu", "cua", "hex", "cir"];
// Array de número de cartas
//var numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// En las pruebas iniciales solo se trabajará con cuatro cartas por palo:
var numeros = [9, 10, 11, 12];


// Tapetes				
var tapeteInicial   = null;
var tapeteSobrantes = null;
var tapeteReceptor1 = null;
var tapeteReceptor2 = null;
var tapeteReceptor3 = null;
var tapeteReceptor4 = null;

// Mazos
var mazoInicial   = [];
var mazoSobrantes = [];
var mazoReceptor1 = [];
var mazoReceptor2 = [];
var mazoReceptor3 = [];
var mazoReceptor4 = [];

var cartaElegida = [];
// Contadores de cartas
var contInicial     = null;
var contSobrantes   = null;
var contReceptor1   = null;
var contReceptor2   = null;
var contReceptor3   = null;
var contReceptor4   = null;
var contMovimientos = null;

var movimientos = 0;
var movimientosTapeteSobrantes = 0;
var movimientosTapete1 = 0;
var movimientosTapete2 = 0;
var movimientosTapete3 = 0;
var movimientosTapete4 = 0;
var movimientosSobrantes = 0;


// Tiempo
var contTiempo  = null // span cuenta tiempo
var segundos 	 = 0;    // cuenta de segundos
var temporizador = null; // manejador del temporizador

var reiniciar =  null;

/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/

 
// Rutina asociada a boton reset
function reiniciarJuego() {
	location.reload();
}

// El juego arranca ya al cargar la página: no se espera a reiniciar

// Desarrollo del comienzo de juego
function comenzarJuego() {
	/* Crear baraja, es decir crear el mazoInicial. Este será un array cuyos 
	elementos serán elementos HTML <img>, siendo cada uno de ellos una carta.
	Sugerencia: en dos bucles for, bárranse los "palos" y los "numeros", formando
	oportunamente el nombre del fichero png que contiene a la carta (recuérdese poner
	el path correcto en la URL asociada al atributo src de <img>). Una vez creado
	el elemento img, inclúyase como elemento del array mazoInicial. 
	*/	

	crearMazoInicial();
	barajar(mazoInicial);
	cargarTapeteInicial(mazoInicial);
	arrancarTiempo();

} // comenzarJuego

/**
 * CREAR MAZO INICIAL LOGICA
 * */

function crearMazoInicial() {
	contadorMazoGlobal=0;
	for (var i = palos.length - 1; i >= 0; i--) {
		for (var j = numeros.length - 1; j >= 0; j--) {
			contadorMazoGlobal++;
			// creamos y agregamos las cartas iniciales en el mazoInicial		
			var rutaCarta = 'imagenes/baraja/'+numeros[j]+'-'+palos[i]+'.png';
			var color = palos[i] == 'hex' || palos[i] == 'cir' ? 'gris' : 'red';
			// objeto de carta para agregar
			// utilizamos una propiedad nueva llamada origen, para saber en donde esta la carta y de que mazo viene
			var cartaActual = {
				ruta: rutaCarta,
				numero: numeros[j],
				mazo: palos[i],
				color,
				origen: 'tapateInicial'
			};
			// agregando carta al mazo inicial
			mazoInicial.push(cartaActual);
		}
	}

	
}

/**
	Se debe encargar de arrancar el temporizador: cada 1000 ms se
	debe ejecutar una función que a partir de la cuenta autoincrementada
	de los segundos (segundos totales) visualice el tiempo oportunamente con el 
	format hh:mm:ss en el contador adecuado.

	Para descomponer los segundos en horas, minutos y segundos pueden emplearse
	las siguientes igualdades:

	segundos = truncar (   segundos_totales % (60)                 )
	minutos  = truncar ( ( segundos_totales % (60*60) )     / 60   )
	horas    = truncar ( ( segundos_totales % (60*60*24)) ) / 3600 )

	donde % denota la operación módulo (resto de la división entre los operadores)

	Así, por ejemplo, si la cuenta de segundos totales es de 134 s, entonces será:
	   00:02:14

	Como existe la posibilidad de "resetear" el juego en cualquier momento, hay que 
	evitar que exista más de un temporizador simultáneo, por lo que debería guardarse
	el resultado de la llamada a setInterval en alguna variable para llamar oportunamente
	a clearInterval en su caso.   
*/

function arrancarTiempo(){
	if (temporizador) clearInterval(temporizador);
    var hms = function (){
			var seg = Math.trunc( segundos % 60 );
			var min = Math.trunc( (segundos % 3600) / 60 );
			var hor = Math.trunc( (segundos % 86400) / 3600 );
			var tiempo = ( (hor<10)? "0"+hor : ""+hor ) 
						+ ":" + ( (min<10)? "0"+min : ""+min )  
						+ ":" + ( (seg<10)? "0"+seg : ""+seg );
			setContador(contTiempo, tiempo);
            segundos++;
		}
	segundos = 0;
    hms(); // Primera visualización 00:00:00
	temporizador = setInterval(hms, 1000);
    	
} // arrancarTiempo
/**
 Se encarga de detener el temporizador

 Para descomponer los segundos en horas, minutos y segundos pueden emplearse
 las siguientes igualdades:

 segundos = truncar (   segundos_totales % (60)                 )
 minutos  = truncar ( ( segundos_totales % (60*60) )     / 60   )
 horas    = truncar ( ( segundos_totales % (60*60*24)) ) / 3600 )

 Como existe la posibilidad de "resetear" el juego en cualquier momento, hay que
 evitar que exista más de un temporizador simultáneo, por lo que debería guardarse
 el resultado de la llamada a setInterval en alguna variable para llamar oportunamente
 a clearInterval en su caso.
 */
function detenerTiempo(){
	if (temporizador) {
		clearInterval(temporizador);
	}
}
/**
	Si mazo es un array de elementos <img>, en esta rutina debe ser
	reordenado aleatoriamente. Al ser un array un objeto, se pasa
	por referencia, de modo que si se altera el orden de dicho array
	dentro de la rutina, esto aparecerá reflejado fuera de la misma.
*/
function barajar(mazo) {
	// usamos sort y random para reorganizar al azar
	mazo.sort(function() { return Math.random() - 0.5 });
} // barajar


/**
 	En el elemento HTML que representa el tapete inicial (variable tapeteInicial)
	se deben añadir como hijos todos los elementos <img> del array mazo.
	Antes de añadirlos, se deberían fijar propiedades como la anchura, la posición,
	coordenadas top y left, algun atributo de tipo data-...
	Al final se debe ajustar el contador de cartas a la cantidad oportuna
*/
function cargarTapeteInicial(mazo) {
	var paso = 5;

	// aquí empezamos a crear las imagenes de las cartas y cargarlas visualmente
	for (const carta of mazo) {
		var nuevaCarta = document.createElement('img');
		nuevaCarta.src = carta.ruta;
		nuevaCarta.style.marginTop = paso+'px';
		nuevaCarta.style.marginLeft = paso+'px';
		nuevaCarta.setAttribute( "draggable", false );		 
		nuevaCarta.setAttribute( "data-palo", carta.mazo);
		nuevaCarta.setAttribute( "data-numero",carta.numero );
		nuevaCarta.setAttribute( "data-color", carta.color );
		nuevaCarta.setAttribute( "data-origen", 'tapeteInicial' );
		nuevaCarta.addEventListener("mousedown", clicEnCarta) ;
		nuevaCarta.addEventListener('dragstart', enviarDataEvento)
		nuevaCarta.id = carta.numero+carta.mazo;
		nuevaCarta.classList.add('cartasTapeteInicial');		
		paso+=7;
		tapeteInicial.appendChild(nuevaCarta);
	}

	incContador(mazo.length);

} // cargarTapeteInicial

/*
En este evento hacemos la mayoría de lógica de la aplicación
se dispara cuando hacemos drop de la carta sobre un tapete 
recibe el mazo que recibe la carta y el evento disparado

Aquí realmente hacemos las comprobaciones y movimientos necesarios para saber si un carta es válida
de donde se debe restar o sumar y a su ves obtenemos los datos de la carta en movimiento por medio de 
getData()
*/
function moverCartaEntreMazos(mazoQueRecibe, evento) {

	// capturamos por medio del evento recibido y usando el getData la información seteada de la carta en movimiento
	let numeroActual = evento.dataTransfer.getData("text/plain/numero");
	let paloActual = evento.dataTransfer.getData("text/plain/palo");
	let colorActual = evento.dataTransfer.getData("text/plain/color");
	let origenActual = evento.dataTransfer.getData("text/plain/origen");

	// verificamos el origen de la carta, para saber si utilizamos el objeto de mazoInicial o mazoSobrantes
	if(origenActual=="tapeteInicial"){
		var cartaEnMovimiento = mazoInicial.filter(function(elemento) {
			if (elemento.numero == numeroActual && elemento.mazo == paloActual)  {
				return elemento;
			}
		});
	} else if (origenActual=="tapeteSobrantes") {
		var cartaEnMovimiento = mazoSobrantes.filter(function(elemento) {
			if (elemento.numero == numeroActual && elemento.mazo == paloActual)  {
				return elemento;
			}
		});
	}
	
	// almacenamos el elemento HTML de la carta actual
	var cartaEnMovimientoId = numeroActual+paloActual;
	var elementoCartaEnMovimiento = document.getElementById(cartaEnMovimientoId);

	// con este switch evaluamos de donde se dispara el evento, en otras palabras sobre que mazo va caer la carta
	switch (mazoQueRecibe) {
	  case 'mazoReceptor1':

	  	// verificamos si existe alguna carta, de lo contrario dejamos la variable en null
		if(mazoReceptor1.length>0){
			var ultimaCartaMazo = mazoReceptor1[mazoReceptor1.length - 1];
		} else {
			var ultimaCartaMazo = null;
		}

		// si no existen cartas entonces siempre debe ser la primera carta con número 12
		if(!ultimaCartaMazo && numeroActual != 12) {
			return;
		}

		// confirmamos si existe una carta en el mazo o ya no tiene
		if( typeof(ultimaCartaMazo) !== undefined && ultimaCartaMazo !== null) {
			
			// convertimos con parseInt para evitar el típico error de concatenar en vez de sumar los números
			var numeroValido = parseInt(numeroActual)+1;
			
			// validaciones de consecutivo y color
			if (ultimaCartaMazo[0].numero != numeroValido || ultimaCartaMazo[0].color == colorActual) {
				return;
			}
		}

		// verificamos de donde viene la carta para restar ese elemento al objeto correspondiente
		if(origenActual=="tapeteInicial"){
			mazoInicial.pop(cartaEnMovimiento);
		} else if (origenActual=="tapeteSobrantes") {
			mazoSobrantes.pop(cartaEnMovimiento);
		}

		// movemos la carta al nuevo mazo
		mazoReceptor1.push(cartaEnMovimiento);

		// hacemos los ajustes visuales y configuraciónes de la carta
	    var contenedorReceptor1 = document.getElementById('receptor1');
	    elementoCartaEnMovimiento.removeAttribute("style");
	    elementoCartaEnMovimiento.style.marginTop = '8px';
	    elementoCartaEnMovimiento.style.marginLeft = '8px';
	    elementoCartaEnMovimiento.style.width = '80px';
		elementoCartaEnMovimiento.classList.remove("moviendoCarta");
		elementoCartaEnMovimiento.setAttribute( "draggable", false );	
		elementoCartaEnMovimiento.setAttribute( "data-origen", 'tapete1' );	

		// incrementamos movimientos globales y movimientos del tapete donde cae la carta
		movimientos = movimientos + 1;
		movimientosTapete1 = movimientosTapete1 + 1;

		// finalmente agregamos todo visualmente
		contenedorReceptor1.appendChild(elementoCartaEnMovimiento);
		contMovimientos.textContent = movimientos;
		contReceptor1.textContent = movimientosTapete1;		

		// verificamos el origen y decrementamos el contador de donde se traslada la carta
		if(origenActual=="tapeteInicial"){
			decContador(contInicial, origenActual);
		} else if (origenActual=="tapeteSobrantes") {
			decContador(contSobrantes, origenActual);
		}

	    break;
	  case 'mazoReceptor2':

		// verificamos si existe alguna carta, de lo contrario dejamos la variable en null
		if(mazoReceptor2.length>0){
			var ultimaCartaMazo = mazoReceptor2[mazoReceptor2.length - 1];
		} else {
			var ultimaCartaMazo = null;
		}

		// si no existen cartas entonces siempre debe ser la primera carta con número 12
		if(!ultimaCartaMazo && numeroActual != 12) {
			return;
		}

		// confirmamos si existe una carta en el mazo o ya no tiene
		if( typeof(ultimaCartaMazo) !== undefined && ultimaCartaMazo !== null) {
			
			// convertimos con parseInt para evitar el típico error de concatenar en vez de sumar los números
			var numeroValido = parseInt(numeroActual)+1;
			
			// validaciones de consecutivo y color
			if (ultimaCartaMazo[0].numero != numeroValido || ultimaCartaMazo[0].color == colorActual) {
				return;
			}
		}

		// verificamos de donde viene la carta para restar ese elemento al objeto correspondiente
		if(origenActual=="tapeteInicial"){
			mazoInicial.pop(cartaEnMovimiento);
		} else if (origenActual=="tapeteSobrantes") {
			mazoSobrantes.pop(cartaEnMovimiento);
		}

		// movemos la carta al nuevo mazo
	  	mazoReceptor2.push(cartaEnMovimiento);

		// hacemos los ajustes visuales y configuraciónes de la carta
	    var contenedorReceptor2 = document.getElementById('receptor2');
	    elementoCartaEnMovimiento.removeAttribute("style");
	    elementoCartaEnMovimiento.style.marginTop = '8px';
	    elementoCartaEnMovimiento.style.marginLeft = '8px';
	    elementoCartaEnMovimiento.style.width = '80px';
		elementoCartaEnMovimiento.classList.remove("moviendoCarta");
		elementoCartaEnMovimiento.setAttribute( "draggable", false );
		// cambiamos este atributo para saber en que tapete se encuentra nuestra carta
		elementoCartaEnMovimiento.setAttribute( "data-origen", 'tapete2' );

		// incrementamos movimientos globales y movimientos del tapete donde cae la carta
		movimientos = movimientos + 1;
		movimientosTapete2 = movimientosTapete2 + 1;

		// finalmente agregamos todo visualmente
		contMovimientos.textContent = movimientos;
		contReceptor2.textContent = movimientosTapete2;
	    contenedorReceptor2.appendChild(elementoCartaEnMovimiento);

		// verificamos el origen y decrementamos el contador de donde se traslada la carta
		if(origenActual=="tapeteInicial"){
			decContador(contInicial, origenActual);
		} else if (origenActual=="tapeteSobrantes") {
			decContador(contSobrantes, origenActual);
		}

	    break;
	  case 'mazoReceptor3':

		// verificamos si existe alguna carta, de lo contrario dejamos la variable en null
		if(mazoReceptor3.length>0){
			var ultimaCartaMazo = mazoReceptor3[mazoReceptor3.length - 1];
		} else {
			var ultimaCartaMazo = null;
		}

		// si no existen cartas entonces siempre debe ser la primera carta con número 12
		if(!ultimaCartaMazo && numeroActual != 12) {
			return;
		}

		// confirmamos si existe una carta en el mazo o ya no tiene
		if( typeof(ultimaCartaMazo) !== undefined && ultimaCartaMazo !== null) {	
			
			// convertimos con parseInt para evitar el típico error de concatenar en vez de sumar los números
			var numeroValido = parseInt(numeroActual)+1;

			// validaciones de consecutivo y color
			if (ultimaCartaMazo[0].numero != numeroValido || ultimaCartaMazo[0].color == colorActual) {
				return;
			}
		}

		// verificamos de donde viene la carta para restar ese elemento al objeto correspondiente
		if(origenActual=="tapeteInicial"){
			mazoInicial.pop(cartaEnMovimiento);
		} else if (origenActual=="tapeteSobrantes") {
			mazoSobrantes.pop(cartaEnMovimiento);
		}

		// movemos la carta al nuevo mazo
	    mazoReceptor3.push(cartaEnMovimiento);

		// hacemos los ajustes visuales y configuraciónes de la carta
	    var contenedorReceptor3 = document.getElementById('receptor3');
	    elementoCartaEnMovimiento.removeAttribute("style");
	    elementoCartaEnMovimiento.style.marginTop = '8px';
	    elementoCartaEnMovimiento.style.marginLeft = '8px';
	    elementoCartaEnMovimiento.style.width = '80px';
		elementoCartaEnMovimiento.classList.remove("moviendoCarta");
		elementoCartaEnMovimiento.setAttribute( "draggable", false );
		// cambiamos este atributo para saber en que tapete se encuentra nuestra carta
		elementoCartaEnMovimiento.setAttribute( "data-origen", 'tapete3' );

		// incrementamos movimientos globales y movimientos del tapete donde cae la carta
		movimientos = movimientos + 1;
		movimientosTapete3 = movimientosTapete3 + 1;

		// finalmente agregamos todo visualmente
		contMovimientos.textContent = movimientos;
		contReceptor3.textContent = movimientosTapete3;
	    contenedorReceptor3.appendChild(elementoCartaEnMovimiento);

		// verificamos el origen y decrementamos el contador de donde se traslada la carta
		if(origenActual=="tapeteInicial"){
			decContador(contInicial, origenActual);
		} else if (origenActual=="tapeteSobrantes") {
			decContador(contSobrantes, origenActual);
		}

	    break;
	  case 'mazoReceptor4':

		// verificamos si existe alguna carta, de lo contrario dejamos la variable en null
		if(mazoReceptor4.length>0){
			var ultimaCartaMazo = mazoReceptor4[mazoReceptor4.length - 1];
		} else {
			var ultimaCartaMazo = null;
		}

		// si no existen cartas entonces siempre debe ser la primera carta con número 12
		if(!ultimaCartaMazo && numeroActual != 12) {
			return;
		}

		// confirmamos si existe una carta en el mazo o ya no tiene
		if( typeof(ultimaCartaMazo) !== undefined && ultimaCartaMazo !== null) {		
			
			// convertimos con parseInt para evitar el típico error de concatenar en vez de sumar los números
			var numeroValido = parseInt(numeroActual)+1;

			// validaciones de consecutivo y color
			if (ultimaCartaMazo[0].numero != numeroValido || ultimaCartaMazo[0].color == colorActual) {
				return;
			}
		}

		// verificamos de donde viene la carta para restar ese elemento al objeto correspondiente
		if(origenActual=="tapeteInicial"){
			mazoInicial.pop(cartaEnMovimiento);
		} else if (origenActual=="tapeteSobrantes") {
			mazoSobrantes.pop(cartaEnMovimiento);
		}

		// movemos la carta al nuevo mazo
	    mazoReceptor4.push(cartaEnMovimiento);

		// hacemos los ajustes visuales y configuraciónes de la carta
	    var contenedorReceptor4 = document.getElementById('receptor4');
	    elementoCartaEnMovimiento.removeAttribute("style");
	    elementoCartaEnMovimiento.style.marginTop = '8px';
	    elementoCartaEnMovimiento.style.marginLeft = '8px';
	    elementoCartaEnMovimiento.style.width = '80px';
		elementoCartaEnMovimiento.classList.remove("moviendoCarta");
		elementoCartaEnMovimiento.setAttribute( "draggable", false );
		// cambiamos este atributo para saber en que tapete se encuentra nuestra carta
		elementoCartaEnMovimiento.setAttribute( "data-origen", 'tapete4' );

		// incrementamos movimientos globales y movimientos del tapete donde cae la carta
		movimientos = movimientos + 1;
		movimientosTapete4 = movimientosTapete4 + 1;

		// finalmente agregamos todo visualmente
		contMovimientos.textContent = movimientos;
		contReceptor4.textContent = movimientosTapete4;
	    contenedorReceptor4.appendChild(elementoCartaEnMovimiento);

		// verificamos el origen y decrementamos el contador de donde se traslada la carta
		if(origenActual=="tapeteInicial"){
			decContador(contInicial, origenActual);
		} else if (origenActual=="tapeteSobrantes") {
			decContador(contSobrantes, origenActual);
		}

	    break;
	case 'sobrantes':

		// siempre se verifica si el origen de la carta es el mazoInicial ya que de lo contrario sería un error
		if(origenActual=="tapeteInicial"){

			// hacemos movimiento lógico de cartas
			mazoInicial.pop(cartaEnMovimiento);
			mazoSobrantes.push(cartaEnMovimiento[0]);

			// hacemos los ajustes visuales y configuraciónes de la carta
			var contenedorMazoSobrantes = document.getElementById('sobrantes');
			elementoCartaEnMovimiento.removeAttribute("style");
			elementoCartaEnMovimiento.style.marginTop = '8px';
			elementoCartaEnMovimiento.style.marginLeft = '8px';
			elementoCartaEnMovimiento.style.width = '80px';
			elementoCartaEnMovimiento.classList.remove("moviendoCarta");
			// cambiamos este atributo para saber en que tapete se encuentra nuestra carta
			elementoCartaEnMovimiento.setAttribute( "data-origen", 'tapeteSobrantes' );

			// incrementamos movimientos globales y movimientos del tapete donde cae la carta
			movimientos = movimientos + 1;
			movimientosSobrantes = movimientosSobrantes + 1;

			// finalmente agregamos todo visualmente
			contMovimientos.textContent = movimientos;
			contSobrantes.textContent = movimientosSobrantes;
			contenedorMazoSobrantes.appendChild(elementoCartaEnMovimiento);

			// decrementamos el contador de donde se traslada la carta
			decContador(contInicial, origenActual);
		} else {
			console.log("Cae en el mismo tapete de sobrantes, no se hace nada");
		}

		break;
	  default:
	    console.log('Lo lamentamos, por el momento no disponemos de ese mazo');
	}


}

/*
	Por medio de este evento realizamos el seteo de los datos de la carta que se esta moviendo
	ya que lo disparamos en el dragstart de la carta
*/
function enviarDataEvento(event) {
	event.dataTransfer.setData( "text/plain/numero", event.target.dataset["numero"] );
	event.dataTransfer.setData( "text/plain/palo", event.target.dataset["palo"] );
	event.dataTransfer.setData( "text/plain/color", event.target.dataset["color"] );
	event.dataTransfer.setData( "text/plain/origen", event.target.dataset["origen"] );
	event.target.classList.add("moviendoCarta");

}

/**
 	Esta función debe incrementar el número correspondiente al contenido textual
   	del elemento que actúa de contador
*/
function incContador(contador){
	contInicial.textContent = contador;
} // incContador


/**
	Idem que anterior, pero decrementando 
*/
function decContador(contador, origen){

	if(origen=="tapeteInicial") {
		// estos movimientos nunca se decrementan porque llevan el conteo de todo el juego
	} else if(origen=="tapeteSobrantes") {
		// debemos decrementar los movimientos de sobrantes porque cuando se suma una carta al tapete de sobrantes esta variable incrementa también
		movimientosSobrantes = movimientosSobrantes - 1;
	}
	
	// capturamos los valores de los contadores actualmente
	var cont = contador.textContent;
	var cartasSobrantes = contSobrantes.textContent;
	var cartasIniciales = contInicial.textContent;

	// realizamos la comprobación inicial para saber si podemos continuar restando a los contadores
	if(cartasSobrantes>0 || cartasIniciales>0){
		var dec = cont -1;
		contador.textContent = dec;
		
		var cont = contador.textContent;
		var cartasSobrantes = contSobrantes.textContent;
		var cartasIniciales = contInicial.textContent;
		
		// validamos si el juego continua o se acabaron las cartas
		if (cartasSobrantes != 0 && cartasIniciales == 0) {

			// reasignamos todas las cartas del mazoSobrantes al mazoInicial para continuar jugando
			mazoInicial = mazoSobrantes;
			barajar(mazoInicial);
			cargarTapeteInicial(mazoInicial);

			// vaciamos mazoSobrantes para empezar a jugar de nuevo sin perder el avance realizado en los mazos receptores
			mazoSobrantes = [];
			var contenedor = document.getElementById('sobrantes');			
			contenedor.innerHTML = '';
			contenedor.appendChild(contSobrantes);
			movimientosSobrantes = 0;
			contSobrantes.textContent = 0;

		} else if (cartasSobrantes == 0 && cartasIniciales == 0) {
			detenerTiempo();
			alertaGanador();
		}
	}

} // decContador

/**
	Similar a las anteriores, pero ajustando la cuenta al
	valor especificado
*/
function setContador(contador, valor) {
	contTiempo.innerHTML = valor;

} // setContador

/*
	Este evento se dispara cada vez que hacemos mousedown 
	sobre una carta y busca obtener datos básicos de la misma
*/
function clicEnCarta(evento) {
	cartaElegida = {
		mazo: evento.target.getAttribute('data-palo'),
		numero: evento.target.getAttribute('data-numero'),
		color: evento.target.getAttribute('data-color'),
		origen: evento.target.getAttribute('data-origen'),
	}

	var ultimaCartaMazo = mazoInicial[mazoInicial.length - 1];
	// con esto controlamos que el elemento que se vaya mover(draggable) sea únicamente el que esta encima del mazo,
	// para evitar mover las cartas que están por debajo
	if (ultimaCartaMazo.mazo == evento.target.getAttribute('data-palo') && ultimaCartaMazo.numero ==  evento.target.getAttribute('data-numero')) {
		var idElementoUsado = evento.target.getAttribute('data-numero')+evento.target.getAttribute('data-palo');
		var cartaImg = document.getElementById(idElementoUsado);
		cartaImg.setAttribute('draggable', true)
	}
}

/**
	Mensaje que se muestra al ganar el juego
*/
function alertaGanador() 
{
	var mensaje;
	// con prompt capturamos el nombre del jugador
	var nombre = prompt("Introduzca su nombre:", "Jugador");
	var tiempoFinalizado = contTiempo.textContent;
	if (nombre == null || nombre == "") {
		mensaje = "Felicitaciones, has ganado el juego en: "+tiempoFinalizado+" de tiempo y en "+movimientos+" total de movimientos";		
	} else {
		mensaje = "Felicitaciones "+nombre+", has ganado el juego en: "+tiempoFinalizado+" de tiempo y en "+movimientos+" total de movimientos";
	}
	// con confirm mostramos un mensaje de felicitaciones y la opción de reiniciar el juego o cancelar
	var opcion = confirm(mensaje + "\t" + "¿Deseas volver a jugar?");
	if (opcion == true) {
		reiniciarJuego();
	}	
}


$(document).ready(function() {
	// se asigna el valor una vez cargado el DOM ya que si se hace antes la variable se guarda como null
	contTiempo = document.getElementById("contador_tiempo");
	tapeteInicial = document.getElementById("inicial");
	reiniciar = document.getElementById("reset");

	contInicial     = document.getElementById('contador_inicial');
 	contSobrantes   = document.getElementById("contador_sobrantes");
 	contReceptor1   = document.getElementById("contador_receptor1");
 	contReceptor2   = document.getElementById("contador_receptor2");
	contReceptor3   = document.getElementById("contador_receptor3");
	contReceptor4   = document.getElementById("contador_receptor4");
	contMovimientos = document.getElementById("contador_movimientos");


    comenzarJuego();

	// definimos los eventos de las elementos que se van a mover (cartas)
    var cartas = document.getElementsByClassName("cartasTapeteInicial");
    for (var i = 0; i < cartas.length; i++) {

		cartas[i].addEventListener("dragstart", enviarDataEvento);

		cartas[i].addEventListener("drag", (event) => {
			// sin acciones en este evento
		});	

		cartas[i].addEventListener("dragend", (event) => {
		 	event.target.classList.remove("moviendoCarta");
		});
	}

	// definimos los eventos de los eventos que van a recibir elementos movibles (tapetes)
	// Tapete sobrantes
	tapeteSobrantes = document.getElementById("sobrantes");
	tapeteSobrantes.addEventListener("dragenter", (event) => {	
		event.preventDefault();
	});

	tapeteSobrantes.addEventListener("dragover", (event) => {		
		event.preventDefault();
	});
	tapeteSobrantes.addEventListener("dragleave", (event) => {
		event.preventDefault();
	});
	tapeteSobrantes.addEventListener("drop", (event) => {
		moverCartaEntreMazos('sobrantes', event);
	});

	// Tapete receptor 1
	tapeteReceptor1 = document.getElementById("receptor1");
	tapeteReceptor1.addEventListener("dragenter", (event) => {
		event.preventDefault();
	});
	tapeteReceptor1.addEventListener("dragover", (event) => {
		event.preventDefault();
	});
	tapeteReceptor1.addEventListener("dragleave", (event) => {
		event.preventDefault();
	});
	tapeteReceptor1.addEventListener("drop", (event) => {
		moverCartaEntreMazos('mazoReceptor1', event);
	});

	// Tapete receptor  2
	tapeteReceptor2 = document.getElementById("receptor2");
	tapeteReceptor2.addEventListener("dragenter", (event) => {
		event.preventDefault();
	});
	tapeteReceptor2.addEventListener("dragover", (event) => {
		event.preventDefault();
	});
	tapeteReceptor2.addEventListener("dragleave", (event) => {
		event.preventDefault();
	});
	tapeteReceptor2.addEventListener("drop", (event) => {
		moverCartaEntreMazos('mazoReceptor2', event);
	});

	// Tapete receptor 3
	tapeteReceptor3 = document.getElementById("receptor3");
	tapeteReceptor3.addEventListener("dragenter", (event) => {
		event.preventDefault();
	});
	tapeteReceptor3.addEventListener("dragover", (event) => {
		event.preventDefault();
	});
	tapeteReceptor3.addEventListener("dragleave", (event) => {
		event.preventDefault();
	});
	tapeteReceptor3.addEventListener("drop", (event) => {
		moverCartaEntreMazos('mazoReceptor3', event);
	});


	// Tapete receptor 4
	tapeteReceptor4 = document.getElementById("receptor4");
	tapeteReceptor4.addEventListener("dragenter", (event) => {
		event.preventDefault();
	});
	tapeteReceptor4.addEventListener("dragover", (event) => {
		event.preventDefault();
	});
	tapeteReceptor4.addEventListener("dragleave", (event) => {
		event.preventDefault();
	});
	tapeteReceptor4.addEventListener("drop", (event) => {
		moverCartaEntreMazos('mazoReceptor4', event);
	});

	reiniciar.addEventListener('click', function() {
		reiniciarJuego();
	});

});
