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
export function formatModel(model){
    if (!model) return '';
    let words = model.split(' ');

    for(let i = 0;  i < words.length; i++){
        switch (words[i]){
        case "xeon":
            words[i] = "Xeon";
            break;
        case 'gold':
            words[i] = 'Gold';
            break;
        case 'silver':
            words[i] = 'Silver';
            break;
        case 'bronze':
            words[i] = 'Bronze';
            break;
        case 'pentium':
            words[i] = 'Pentium';
            break;
        case 'platinum':
            words[i] = 'Platinum';
            break;
        case 'epyc':
            words[i] = 'EPYC';
            break;
        default:
            words[i] = words[i].toUpperCase();
            break;
        }

    }

    model = words.join(" ");

    return model;
}