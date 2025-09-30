export function cpuBrandFormatter(title){
    if(!title) return 'N/A';
    switch(title){
        case 'intel':
            title = 'Intel';
            break;
        case 'amd': 
            title = 'AMD';
            break;
    }

    return title;
}

// Missing Model format