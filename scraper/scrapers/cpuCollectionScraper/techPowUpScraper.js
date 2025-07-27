import puppeteer from "puppeteer";

const pageArr =[
'https://www.techpowerup.com/cpu-specs/?f=socket_AMD+Socket+AM5~generation_AMD+EPYC',
'https://www.techpowerup.com/cpu-specs/?f=socket_AMD+Socket+SP3~generation_AMD+EPYC',
'https://www.techpowerup.com/cpu-specs/?f=socket_AMD+Socket+SP5~generation_AMD+EPYC',
'https://www.techpowerup.com/cpu-specs/?f=socket_Intel+Socket+2011-3~generation_Intel+Xeon+E5',
'https://www.techpowerup.com/cpu-specs/?f=socket_Intel+Socket+2011-3~generation_Intel+Xeon+E7',
'https://www.techpowerup.com/cpu-specs/?f=socket~generation_Intel+Xeon+Silver',
'https://www.techpowerup.com/cpu-specs/?f=socket~generation_Intel+Xeon+Gold',
'https://www.techpowerup.com/cpu-specs/?f=socket~generation_Intel+Xeon+Platinum'
];

export const techpowerupCPU = async () => {

    let scrapped_data = [];
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try{

        for(let pg of pageArr){
            await page.goto(pg, {waitUntil: 'domcontentloaded', timeout: 60000});

            let cpuTitle = await page.$$eval('.items-desktop-table td a', el => 
                el.map(title => {
                    return title ? title.textContent.trim() : 'No Title';
                })
            );

            let cpuLink = await page.$$eval('.items-desktop-table td a', el => 
                el.map(title => {
                    return title ? title.href : 'No Link';
                })
            );

            cpuTitle.forEach((title, idx) => {
                const link = cpuLink[idx];
                scrapped_data.push({title, link});
            });
        }

        console.log(scrapped_data);
    

        await browser.close();
        

    }catch(e){
        console.log(e);
    }

}