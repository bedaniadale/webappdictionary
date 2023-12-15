var searchButton = document.querySelector("#searchbutton")
var searchBar = document.querySelector("#wordinput")
var mainWord = document.querySelector("#mainword") 
var phonetics = document.querySelector("#phonetics")

var meaningbox = document.querySelector(".meaning-wrapper")



var searchBarClicked = 0

function resetBar() { 
    searchBar.style.width = "0%" 
    searchButton.innerHTML = 'search'
    searchBarClicked = 0
    searchBar.value = ''
    return
}

function fillDiv(pos, def, ex, syns) { 

    let synonymwords = ''
    for(let i = 0; i < syns.length; i++) { 
        let curr  = '' 
        curr = `<li> ${syns[i]} </li>`
        synonymwords+=curr
    }
    return `<div class="meaning-box"> 
    <div class="mbb">
        <div class="partofspeech">
            <h1> ${pos} </h1>
        </div>

        <div class="propbox">
            <div class="def-title">
                <h1> Definition </h1>
            </div>

            <div class="def-list">
                <ul> 
                    <li> ${def} </li>
                    
                </ul>
            </div>
        </div>


        <div class="propbox">
            <div class="def-title">
                <h1> Example </h1>
            </div>

            <div class="def-list">
                <ul> 
                    <li> ${ex}</li>
                    
                </ul>
            </div>
        </div>

        <div class="synonyms">
            <div class="syn-title">
                 <h1> Synonyms </h1>
            </div>

            <div class="syn-list">
                <ul> `

                 + 
                
                   synonymwords
                  
                + `
                </ul>
            </div>
        </div>


    </div>

    
</div>
`
}

function getDefinitionAndExample(items) {
    
    for(let i = 0; i < items.length; i++) { 
        // console.log(items[i])
        if(items[i]['example']) { 
            return [items[i]['definition'], items[i]['example']]
           
        }
    }
    return [items[0]['definition'], 'No example given']
}

function getSynonyms(items){ 
    let synonyms = []
    if(items.length == 0) { 
        return ["None"]
    }

    for(let i = 0; i < items.length; i++) { 
        synonyms.push(items[i])
        if(synonyms.length == 5) { 
            return synonyms
        }
    }
    return synonyms
}

async function searchWord(word) { 
    let apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`

    let response = await fetch(apiUrl).then((res)=> { 
            return res.json() 

    })
    if( response['title'] == 'No Definitions Found') { 
        alert("no definition found")
        let mainword = document.querySelector(".mainword")
        mainword.style.opacity = "0"
        meaningbox.innerHTML = ""
        return
    }
    let mainword = document.querySelector(".mainword")
    mainword.style.opacity = "1"
    let synonyms = []

    mainWord.innerHTML = word
    if(response[0]['phonetic']) { 
        phonetics.innerHTML = response[0]['phonetic']
    } else { 
        phonetics.innerHTML = response[0]['phonetics'][1]['text']
    }
    let meaningLength = response[0].meanings.length
    // console.log(response[0])
    let tab = ''
    for(let i = 0; i < meaningLength; i++){ 
        let curr_pos = response[0].meanings[i]['partOfSpeech']
        let defex = getDefinitionAndExample(response[0].meanings[i]['definitions'])//response[0].meanings[i]['definitions
        let curr_definition = defex[0] 
        let curr_example = defex[1]
        // console.log(response[0].meanings[i]['synonyms'])
        let synonyms = getSynonyms(response[0].meanings[i]['synonyms'])
        let assembleDiv = fillDiv(curr_pos, curr_definition, curr_example, synonyms)
        tab+=assembleDiv
    }

    meaningbox.innerHTML = tab



    

    
   
} 

function openSearchBar(status){ 
    if(status == 0) { 
        searchBar.style.width = "85%" 
        searchButton.innerHTML = 'check'
        searchBarClicked = 1
        return
    }

    let searchInput = searchBar.value 
    if(searchInput == "") { 
        alert("Word cannot be blanked!")
        return
    } 
  
    
    searchWord(searchInput)

    resetBar()
    return
   
}
searchButton.addEventListener("click",()=> { 
    openSearchBar(searchBarClicked)
})
