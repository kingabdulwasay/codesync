 const themeNames = [
  "3024-day", "3024-night", "abbott", "abcdef", "ambiance", "ambiance-mobile",
  "base16-dark", "base16-light", "bespin", "blackboard", "cobalt", "colorforth",
  "darcula", "dracula", "duotone-dark", "duotone-light", "eclipse", "elegant",
  "erlang-dark", "gruvbox-dark", "hopscotch", "icecoder", "idea", "isotope",
  "lesser-dark", "liquibyte", "lucario", "material", "material-darker", "material-palenight",
  "material-ocean", "mbo", "mdn-like", "midnight", "monokai", "neat", "neo", "night",
  "nord", "oceanic-next", "paraiso-dark", "paraiso-light", "pastel-on-dark", "railscasts",
  "rubyblue", "seti", "shadowfox", "solarized", "ssms", "the-matrix", "tomorrow-night-bright",
  "tomorrow-night-eighties", "ttcn", "twilight", "vibrant-ink", "xq-dark", "xq-light",
  "yeti", "yonce", "zenburn"
];

  const topLanguages = [
    { language: "JavaScript", frameworks: ["React", "Vue", "Angular", "Next.js", "Express"] },
    { language: "Python", frameworks: ["Django", "Flask", "FastAPI", "Pyramid", "Tornado"] },
    { language: "Java", frameworks: ["Spring Boot", "Hibernate", "Struts", "JSF"] },
    { language: "C#", frameworks: [".NET", "ASP.NET Core", "Blazor"] },
    { language: "TypeScript", frameworks: ["NestJS", "Angular", "Next.js"] },
    { language: "PHP", frameworks: ["Laravel", "Symfony", "CodeIgniter", "Zend"] },
    { language: "Ruby", frameworks: ["Ruby on Rails", "Sinatra", "Hanami"] },
    { language: "C++", frameworks: ["Qt", "Boost", "Cinder", "JUCE"] },
    { language: "Go", frameworks: ["Gin", "Echo", "Fiber", "Beego"] },
    { language: "Swift", frameworks: ["SwiftUI", "UIKit", "Vapor"] }
  ];

let val = ''
let localId = ''
let localStream = null
let remoteId = ''
let currentConnnection = null
let audio = null;
let currentCall = null
 const editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
        lineNumbers: true,
      mode: "javascript",
      theme: 'icecoder',
      matchBrackets: true,
      autoCloseBrackets: true,
       extraKeys: {
      "Ctrl-Space": "autocomplete"
    },
    hintOptions: {
      completeSingle: false // prevents it from auto-selecting
    }
    })
    document.addEventListener('DOMContentLoaded', ()=>{
    const peer = new Peer()
    peer.on('open', id => {
        localId = id
        editor.setValue('Your sync id: '+ id)
        navigator.clipboard.writeText(localId)
        alert('Sync id copied to clipboard')
    })
document.getElementById('share-toggle').addEventListener('click', ()=>{
  remoteId = window.prompt('Enter remote sync id: ')
   const conn = peer.connect(remoteId)
  
   conn.on('open', ()=>{
    currentConnnection = conn
     editor.setValue('//Start typing code with friends')
            editor.on("change", (instance) => {
                setTimeout(()=>{
                    currentConnnection.send({code: instance.getValue()})

                }, 300)
});
   })
   conn.on('data', data => {
    const cursor = editor.getCursor()

      editor.setValue(data.code)
      editor.setCursor(cursor)
   })


})
peer.on('connection', conn => {
    conn.on('open', ()=>{
          editor.setValue('//Start typing code with friends')
        currentConnnection = conn
         editor.on("change", (instance) => {
            setTimeout(()=>{
                currentConnnection.send({code: instance.getValue()})
            }, 300)
});

    })
       conn.on('data', data => {
        const cursor = editor.getCursor()
            editor.setValue(data.code)
            editor.setCursor(cursor)
   })
})
document.getElementById('audio').addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({video:false, audio:true}).then(stream=>{
        document.getElementById('audio').classList.add('active')
          if (currentCall) {
                currentCall.close()
            }
            localStream = stream
        if (currentConnnection) {
         
            const call  = peer.call(remoteId, stream)
            currentCall = call
            call.on('stream', remoteStream => {
                audio = new Audio()
                audio.srcObject = remoteStream
                audio.play()
            })
            call.on('close', ()=>{ 
                audio.srcObject = null
             })

        }
    }).catch(err => {
        alert(err)
    })
})
peer.on('call', call=>{
    if (currentCall) {
        currentCall.close()
    }
    if (localStream) {
        call.answer(localStream)
    }
    currentCall = call
    call.on('stream', remoteStream => {
        audio  = new Audio()
        audio.srcObject = remoteStream
        audio.play()
    })
      call.on('close', ()=>{ 

      
                audio.srcObject = null
})

})

    })

    const selectBox = document.getElementById('select')
    for (let index = 0; index <  themeNames.length; index++) {
        let option  = document.createElement('option')
        option.value = themeNames[index]
        option.innerText = themeNames[index]
        selectBox.appendChild(option)
    }
    selectBox.addEventListener('change', ()=>{
        val = selectBox.value
         editor.setOption('theme', val)
    })


      const languageSelect = document.getElementById('lang')
    for (let index = 0; index <  topLanguages.length; index++) {
         let optgrp  = document.createElement('optgroup')
         optgrp.label = topLanguages[index].language
         for (let j = 0; j < topLanguages[index].frameworks.length; j++) {
        let option  = document.createElement('option')
        option.value = topLanguages[index].frameworks[j]
        option.innerText = topLanguages[index].frameworks[j]
        optgrp.appendChild(option)
         }
        let option  = document.createElement('option')
        option.value = themeNames[index]
        option.innerText = themeNames[index]
       languageSelect.appendChild(optgrp)
    }
    

document.getElementById('send-btn').addEventListener('click', ()=>{

    if (currentConnnection) {
        
        alert('Yes, Connection exist')
    }else{
        alert('No, Connection does not exist')

    }
})

document.getElementById('get-id').addEventListener('click', () => {
     alert(`Your Sync id: ${localId}`)
     navigator.clipboard.writeText(localId)
})