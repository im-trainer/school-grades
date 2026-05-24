import puppeteer from 'puppeteer-core'
import { execSync } from 'child_process'
import { mkdirSync } from 'fs'

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL = 'http://localhost:5173/school-grades/'
const OUT = './docs'

mkdirSync(OUT, { recursive: true })

const SUBJECTS_DATA = [
  { id: 's1', name: 'Română', grades: [8, 7, 7, 4, 7, 10, 6, 7, 4, 9] },
  { id: 's2', name: 'Matematică', grades: [7, 4, 5, 4, 6, 6, 8, 9] },
  { id: 's3', name: 'Fizică', grades: [4, 6, 5, 7, 10] },
  { id: 's4', name: 'Chimie', grades: [7, 7, 8, 7, 7, 8] },
  { id: 's5', name: 'Biologie', grades: [5, 7, 5, 10, 8] },
  { id: 's6', name: 'Geografie', grades: [10, 10, 8, 10] },
  { id: 's7', name: 'Istorie', grades: [9, 10, 10] },
  { id: 's8', name: 'Engleză', grades: [10, 8, 10, 9] },
  { id: 's9', name: 'Franceză', grades: [8, 7, 9] },
  { id: 's10', name: 'Latină', grades: [10, 10, 6, 8, 10] },
  { id: 's11', name: 'Educație fizică', grades: [10, 10] },
  { id: 's12', name: 'Arte vizuale', grades: [10, 10, 10] },
  { id: 's13', name: 'Religie', grades: [10, 10, 10, 10] },
  { id: 's14', name: 'TIC', grades: [10, 10, 10, 9] },
]

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 900 },
  })

  const page = await browser.newPage()

  // Navigate first to set origin
  await page.goto(URL, { waitUntil: 'networkidle0' })

  // Inject localStorage data
  await page.evaluate((data) => {
    localStorage.setItem('school-grades-v1', JSON.stringify(data))
  }, SUBJECTS_DATA)

  // Reload to pick up the data
  await page.reload({ waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 600))

  // Screenshot 1: Dashboard overview
  await page.screenshot({ path: `${OUT}/screenshot-dashboard.png`, fullPage: false })
  console.log('✓ screenshot-dashboard.png')

  // Screenshot 2: Smart hint open on Matematică card
  await page.evaluate(() => {
    const cards = document.querySelectorAll('.subject-card')
    for (const card of cards) {
      const title = card.querySelector('.subject-title')
      if (title && title.textContent.includes('Matematică')) {
        const slider = card.querySelector('input[type="range"]')
        if (slider) {
          slider.value = '8'
          slider.dispatchEvent(new Event('input', { bubbles: true }))
        }
      }
    }
  })
  await new Promise(r => setTimeout(r, 300))
  await page.screenshot({ path: `${OUT}/screenshot-smarthint.png`, fullPage: false })
  console.log('✓ screenshot-smarthint.png')

  // Screenshot 3: Collapse all
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const btn = btns.find(b => b.textContent.includes('Restrânge tot'))
    if (btn) btn.click()
  })
  await new Promise(r => setTimeout(r, 300))
  await page.screenshot({ path: `${OUT}/screenshot-collapsed.png`, fullPage: false })
  console.log('✓ screenshot-collapsed.png')

  // Screenshot 4: Class picker modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const btn = btns.find(b => b.textContent.trim().startsWith('Materii'))
    if (btn) btn.click()
  })
  await new Promise(r => setTimeout(r, 400))
  await page.screenshot({ path: `${OUT}/screenshot-class-picker.png`, fullPage: false })
  console.log('✓ screenshot-class-picker.png')

  await browser.close()
  console.log('Done.')
}

run().catch(err => { console.error(err); process.exit(1) })
