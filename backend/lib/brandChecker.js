export default function brandChecker(branding){
    let brand = '';
    switch(branding){
        case 'dell': 
            brand = 'Dell';
            break;
        case 'hpe': 
            brand = 'HPE';
            break;
        case 'supermicro':
            brand = 'Supermicro';
            break;
        case 'cloud-ninjas':
            brand = 'Cloud Ninjas';
            break;
        case 'gigabyte':
            brand = 'Gigabyte';
            break;
        case 'asus':
            brand = 'ASUS';
            break
        case 'tyan':
            brand = 'Tyan';
            break;
        // Need to add more Brands
        default:
            break;
    }

    return brand;
}