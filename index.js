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
    let example = ex = "undefined" ? "No example given" : ex

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
                    <li> ${example}</li>
                    
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

async function searchWord(word) { 
    let apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`

    let response = await fetch(apiUrl).then((res)=> { 
            return res.json() 

    })
    if( response['title'] == 'No Definitions Found') { 
        alert("no definition found")
        return
    }
    let synonyms = []
    console.log(response[0] )
    
    mainWord.innerHTML = word
    if(response[0]['phonetic']) { 
        phonetics.innerHTML = response[0]['phonetic']
    } else { 
        phonetics.innerHTML = response[0]['phonetics'][1]['text']
    }
    let meaningLength = response[0].meanings.length
   
    let tab = ''
    for(let i = 0; i < meaningLength; i++){ 
        let curr_pos = response[0].meanings[i]['partOfSpeech']
        let curr_definition = response[0].meanings[i]['definitions'][0]['definition']
        let curr_example = response[0].meanings[i]['definitions'][0 ]['example'] 
        let syn_count = response[0].meanings[i]['definitions'][0]['synonyms'].length
        let synarrays = response[0].meanings[i]['definitions'][0]['synonyms']
        if(syn_count == 0) { 
            synonyms.push("None") 
        } else { 
            for(let j = 0; j < syn_count; j++){ 
                if(synonyms[0] == 'None'){ 
                    break
                }
                synonyms.push(synarrays[j])
            } 
        }
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
