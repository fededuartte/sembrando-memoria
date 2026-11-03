const brandAnimation = document.querySelector('.brand-animation');
    if (brandAnimation) {
      brandAnimation.addEventListener('ended', () => {
        brandAnimation.pause();
      });
      const startBrandAnimation = () => {
        brandAnimation.currentTime = 0;
        const playback = brandAnimation.play();
        if (playback && typeof playback.catch === 'function') {
          playback.catch(() => {
            // Algunos navegadores bloquean autoplay; el video queda disponible
            // para iniciarse si el usuario interactúa con la página.
          });
        }
      };
      if (brandAnimation.readyState >= 2) startBrandAnimation();
      else brandAnimation.addEventListener('loadeddata', startBrandAnimation, { once: true });
    }

    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    menuToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navLinks.classList.remove('open'); menuToggle.setAttribute('aria-expanded','false');
    }));

    const quizData = [
      {q:'¿Cuál es uno de los objetivos centrales de Sembrando Memoria?',a:['Recuperar y visibilizar las historias de las mujeres de la resistencia chaqueña.','Contar la historia sin testimonios personales.','Recordar únicamente los acontecimientos nacionales.'],c:0,e:'El proyecto busca recuperar testimonios y reconocer las experiencias de las mujeres en el territorio chaqueño.'},
      {q:'¿Cómo propone representar a las protagonistas?',a:['Solamente como víctimas.','Como sujetos políticos activos, con ideas, organización y proyectos colectivos.','Como figuras alejadas de su contexto social.'],c:1,e:'Sus historias también hablan de participación, convicciones, vínculos y formas de resistencia.'},
      {q:'¿Qué período histórico recibe especial atención?',a:['La década de 1920.','La década de 1970 y la última dictadura cívico-militar argentina.','Únicamente los años posteriores a 2001.'],c:1,e:'El proyecto se enfoca especialmente en la década de 1970 y la última dictadura, sin perder de vista otros procesos de militancia.'},
      {q:'¿Qué representa la idea de “sembrar” en el nombre del proyecto?',a:['Olvidar el pasado para empezar de nuevo.','Guardar las historias sin compartirlas.','Volver a poner en circulación ideas, vínculos y memorias para que crezcan en el presente.'],c:2,e:'Sembrar es una metáfora de transmisión: recuperar esas historias permite que sigan creciendo y dialogando con el presente.'}
    ];
    let current = 0, score = 0, answered = false;
    const qEl=document.getElementById('question'), aEl=document.getElementById('answers'), fEl=document.getElementById('feedback');
    const next=document.getElementById('nextQuestion');
    function renderQuestion(){
      answered=false; const item=quizData[current];
      document.getElementById('questionCount').textContent=`Pregunta ${current+1} de ${quizData.length}`;
      document.getElementById('score').textContent=`Aciertos: ${score}`;
      qEl.textContent=item.q; fEl.textContent=''; aEl.innerHTML='';
      item.a.forEach((answer,index)=>{
        const btn=document.createElement('button'); btn.className='answer'; btn.textContent=answer;
        btn.addEventListener('click',()=>chooseAnswer(index,btn)); aEl.appendChild(btn);
      });
      next.disabled=true; next.textContent=current===quizData.length-1?'Ver resultado':'Siguiente →';
      document.getElementById('progressText').textContent='Elegí una respuesta para continuar.';
    }
    function chooseAnswer(index,button){
      if(answered)return; answered=true; const item=quizData[current];
      [...aEl.children].forEach((b,i)=>{b.disabled=true;if(i===item.c)b.classList.add('correct')});
      if(index===item.c){score++;fEl.textContent='¡Correcto! '+item.e}
      else{button.classList.add('wrong');fEl.textContent='No exactamente. '+item.e}
      document.getElementById('score').textContent=`Aciertos: ${score}`;
      document.getElementById('progressText').textContent='¡Bien! Ya podés avanzar.';
      next.disabled=false;
    }
    next.addEventListener('click',()=>{
      if(!answered)return;
      if(current<quizData.length-1){current++;renderQuestion()}
      else{
        qEl.textContent=`¡Terminaste! Tu resultado: ${score} de ${quizData.length}.`;
        aEl.innerHTML='<p>La memoria se construye cuando las historias se escuchan, se comparten y se transmiten.</p>';
        fEl.textContent='Gracias por recorrer este pequeño camino de aprendizaje.';
        next.textContent='Volver a jugar';next.disabled=false;
        document.getElementById('questionCount').textContent='Recorrido completado';
        document.getElementById('progressText').textContent='';next.onclick=()=>{current=0;score=0;next.onclick=null;renderQuestion()};
      }
    });
    renderQuestion();

    document.getElementById('messageForm').addEventListener('submit',event=>{
      event.preventDefault();
      const recipient=''; // Reemplazar por el correo oficial del proyecto.
      const data=new FormData(event.currentTarget);
      const subject=encodeURIComponent(data.get('subject') || 'Mensaje desde Sembrando Memoria');
      const body=encodeURIComponent(`Nombre: ${data.get('name')}
Correo: ${data.get('email')}

${data.get('message')}`);
      if(!recipient){
        document.getElementById('formStatus').textContent='El formulario está listo, pero falta configurar el correo oficial: buscá recipient en el código y agregá la dirección de contacto.';
        return;
      }
      window.location.href=`mailto:${recipient}?subject=${subject}&body=${body}`;
    });
