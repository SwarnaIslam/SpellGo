window.speeds = {
    normal: 40,
    pause: 500,
    slow: 120,
    fast: 20
}
window.guidance={
    bubbleSort:{
        swap:[
            
            {text:"If you see the first stair strictly larger than the second one, then swap",speed:window.speeds.normal}
        ],
        skip:[
            {text:"If you see the first stair samller than the second one, then skip",speed:window.speeds.normal}
            
        ]
    },
    binarySearch:{
        pickRight:[
            {text:"If the middle page contains potion name that is lexicographically smaller, then there is no need to check left as left part will only contain potions that are earlier than the desired one.", speed:window.speeds.normal},
            {text:"Simply go to right!",speed:window.speeds.fast }
        ],
        pickLeft:[
            {text:"If the middle page contains potion name that is lexicographically bigger or equal, then there simply go to left as left part may contain earlier reference.", speed:window.speeds.normal},
        ]
    },
    mergeSort:{
        divide:[
            {text:"Keep dividing the branches into two until each branch holds non poisonous fruits. Each new branch will hold half of the total fruits", speed: window.speeds.normal},
            {text:"...", speed:window.speeds.slow},
            {text:"Can you see that a single fruit is non poisonous as it is already sorted?", speed: window.speeds.fast}
        ],
        merge:[
            {text:"Once you find two conquered sorted branch, merge them into one branch. Repeatedly compare the first two fruit in both branch. Pick the smaller one into the new branch until every fruit is picked", speed: window.speeds.normal}
        ]
    },
    dijkstra:{
        minSrc:[
            {text:"Confirm a village with minimum cost.", speed:window.speeds.normal}
        ],
        minAdj:[
            {text:"Only update if going through this path minimizes cost.", speed:window.speeds.normal}
        ]
    },
    kmp:{
        guide2:[
            {text:"If the current element matches with the potential element then set length to length+1 as the next potential match will start after that. Updating the lps with length move forward! ",speed:window.speeds.normal}
        ],
        guide3:[
            {text:"If the current element doesn't match with the potential match, first we have to go one step behind the potential match by length-1. Now if we check lps for length-1, we will go back to the immediately previous potential match. Set length to lps of length-1 iteratively until we reach a potential match that actually matches!",speed:window.speeds.normal}
        ],
        guide1:[
            {text:"LPS is the longest proper prefix that is also suffix.",speed:window.speeds.normal},
            {text:"Length denotes where we can possibly find a match. Initially it is set to zero",speed:window.speeds.normal},
            {text:"We cannot compare element at index 0 with an element before it as there is nothing before.", speed:window.speeds.normal},
            {text:"right?", speed:window.speeds.slow},
            {text:"Simply update lps to 0 and move forward!", speed:window.speeds.fast}
        ],
        guide4:[
            {text:"If the current element of the slimes matches with the current element of slime pattern, set length to length+1 and start the next matching after the current element. Else keep going back in the slime pattern to find the potential match by setting length to lps of length-1 until length becomes zero. Length becoming 0 means no match can be found. So just move forward!", speed: window.speeds.normal}
        ],
        guide5:[
            {text:"If length becomes the size of the pattern that mean we have found a pattern matching! To start matching from next, find the potential match in the pattern that may match with the next current slime element by going back to lps of length-1 iteratively until length becomes 0. In that case reset!", speed:window.speeds.normal}
        ]

    },
    huffman:{
        guide1:[
            {text:"Pick the node with minimum frequency as the left child and the node with second minimum frequency as the right child of the new internal node. Frequency of the new node will be sum of frequency of two children node",  speed: window.speeds.normal}
        ],
        guide2:[
            {text:"Traverse from the root to the leaf node. While travering left child, write 0 and 1 if it is right child",speed: window.speeds.normal}
        ]
    }
}

window.hints = {
    bubbleSort: {
        swapErr: [
            {text: "Oh no! Magic power was overused while the first stairo swapped the second stairo!",speed: window.speeds.fast},
            {text:"What was wrong?", speed: window.speeds.slow},
            {text:"Better time travel back and fix my mistake!",speed: window.speeds.normal}
        ],
        skipErr: [
            {text:"Oh no! Two steps are not sorted yet", speed:window.speeds.normal},
            {text:"...",speed:window.speeds.pause},
            {text:"Should they be skipped?", speed: window.speeds.normal}
        ],
        equalErr: [
            
        ]
    },
    dijkstra:{
        minErr:[
            {text:"This city is already defeated!", speed:window.speeds.fast}
        ],
        naErr:[
            {text:"Pick the city with the minimum cost to get better result.", speed:window.speeds.normal}
        ]
    },
    mergeSort:{
        misstep1:[
            {text:"Divide first, then conquer!", speed:window.speeds.fast}
        ],
        misstep2:[
            {text:"Why dividing when already conquered", speed:window.speeds.normal},
            {text:".....",speed:window.speeds.slow}
        ],
        misstep3:[
            {text:"Maybe the smaller fruit is in the other branch!",speed:window.speeds.fast}
        ]
    },
    binarySearch:{
        pickRight:[
            {text:"As the middle page contains potion that is lexicographically smaller than the desired one, left part will not contain the potion.",speed:window.speeds.normal}
        ],
        pickLeft:[
            {text:"As the middle page contains potion name that is lexicographically bigger, previous pages may contain the desired potion's name.", speed: window.speeds.normal}
        ]
    },
    kmp:{
        hint1:[
            {text:"If we cannot go back any further or the current element actually macthes with the potential element then there is no need to go back.",speed: window.speeds.normal}
        ],
        hint2:[
            {text:"If there is no potential match, no need to update!", speed: window.speeds.normal}
        ],
        hint3:[
            {text:"We should look for more potentials before moving forward!", speed: window.speeds.fast}
        ],
        hint4:[
            {text:"Remeber previous potential match is at lps of length-1",speed: window.speeds.normal}
        ],
        hint5:[
            {text:"Look carefully if there is a match!", speed: window.speeds.normal}
        ],
        hint6:[
            {text:"Is it a match?", speed: window.speeds.normal}
        ]
    },
    huffman:{
        hint1:[
            {text:"Set the node with minimum frequency as the left child", speed: window.speeds.normal}
        ],
        hint2:[
            {text:"Set the node with second minimum frequency as the right child", speed: window.speeds.normal}
        ],
        hint3:[
            {text:"Traversing this path won't allow to reach the character",speed: window.speeds.normal}
        ],
    }
}