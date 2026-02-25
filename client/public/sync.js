// Sincronización entre localStorage y servidor
async function sincronizarEvaluaciones() {
    const evaluaciones = JSON.parse(localStorage.getItem('evaluacionesSIGER') || '[]');
    const noSincronizadas = evaluaciones.filter(e => !e.sincronizado);
    
    for (const eval of noSincronizadas) {
        try {
            const response = await fetch('/api/trpc/evaluaciones.saveFromForm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    json: {
                        fecha: eval.fecha,
                        numeroReporte: eval.numeroReporte,
                        formaReporte: eval.formaReporte,
                        tipoOcurrencia: eval.tipoOcurrencia,
                        regulacion: eval.regulacion,
                        probabilidad: eval.probabilidad,
                        severidad: eval.severidad,
                        indiceRiesgo: eval.indiceRiesgo,
                        descripcion: eval.descripcion,
                        accionMitigadora: eval.accionMitigadora,
                    }
                })
            });
            
            if (response.ok) {
                eval.sincronizado = true;
            }
        } catch (error) {
            console.log('Error sincronizando:', error);
        }
    }
    
    localStorage.setItem('evaluacionesSIGER', JSON.stringify(evaluaciones));
}

// Sincronizar cada 30 segundos
setInterval(sincronizarEvaluaciones, 30000);

// Sincronizar al cargar la página
window.addEventListener('load', sincronizarEvaluaciones);
