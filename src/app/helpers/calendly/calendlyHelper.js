export const spawnCalendly = function(title, address){

    setTimeout(()=>{
        Calendly.initInlineWidget({
            url: 'https://calendly.com/spotbie-demos/45min',
            parentElement: document.getElementById('calendlyEl'),
            prefill: {
                customAnswers: {
                    a2: title,
                    a3: address
                }
            },
            utm: {}
        });
    }, 500)

    console.log('cas', Calendly)

}