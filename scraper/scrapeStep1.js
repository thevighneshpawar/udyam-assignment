// scraper/scrapeStep1.js
import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const OUT_DIR = path.join(__dirname, 'scraped-data')
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

const delay = ms => new Promise(res => setTimeout(res, ms))

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 900 },
    slowMo: 30
  })

  try {
    const page = await browser.newPage()
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
    )

    console.log('Navigating to Udyam Registration...')
    await page.goto('https://udyamregistration.gov.in/UdyamRegistration.aspx', {
      waitUntil: 'networkidle2',
      timeout: 60000
    })

    // Step 1: Capture all form elements comprehensively
    const formElements = await page.evaluate(() => {
      const results = []

      // 1. Input fields (text, number, etc.) with labels
      const labels = document.querySelectorAll('label')
      labels.forEach(label => {
        const text = label.innerText.toLowerCase().trim()
        if (
          text.includes('aadhaar') ||
          text.includes('आधार') ||
          text.includes('entrepreneur') ||
          text.includes('नाम') ||
          text.includes('name')
        ) {
          const input = label
            .closest('.form-group')
            ?.querySelector(
              'input[type="text"], input[type="number"], input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"])'
            )
          if (input) {
            results.push({
              elementType: 'input',
              fieldType: 'text',
              id: input.id || null,
              name: input.name || null,
              label: label.innerText.trim(),
              type: input.type || 'text',
              placeholder: input.placeholder || '',
              required: input.required || false,
              maxLength: input.maxLength > 0 ? input.maxLength : null,
              pattern: input.pattern || '',
              value: input.value || '',
              className: input.className || ''
            })
          }
        }
      })

      // 2. Checkboxes (especially consent checkbox)
      const checkboxes = document.querySelectorAll('input[type="checkbox"]')
      checkboxes.forEach(checkbox => {
        const label =
          checkbox.closest('label') ||
          document.querySelector(`label[for="${checkbox.id}"]`) ||
          checkbox.nextElementSibling ||
          checkbox.parentElement

        const labelText = label ? label.innerText.trim() : 'Unnamed checkbox'

        results.push({
          elementType: 'input',
          fieldType: 'checkbox',
          id: checkbox.id || null,
          name: checkbox.name || null,
          label: labelText,
          type: 'checkbox',
          required: checkbox.required || false,
          checked: checkbox.checked || false,
          value: checkbox.value || '',
          className: checkbox.className || ''
        })
      })

      // 3. Buttons (submit buttons, regular buttons)
      const buttons = document.querySelectorAll(
        'button, input[type="submit"], input[type="button"]'
      )
      buttons.forEach(button => {
        const buttonText =
          button.innerText || button.value || button.textContent || ''
        const isValidateButton =
          buttonText.toLowerCase().includes('validate') ||
          buttonText.toLowerCase().includes('generate') ||
          buttonText.toLowerCase().includes('otp')

        if (isValidateButton || buttonText.length > 0) {
          results.push({
            elementType: 'button',
            fieldType: 'button',
            id: button.id || null,
            name: button.name || null,
            label: buttonText.trim(),
            type: button.type || 'button',
            tagName: button.tagName.toLowerCase(),
            text: buttonText.trim(),
            className: button.className || '',
            disabled: button.disabled || false
          })
        }
      })

      // 4. Select dropdowns (if any)
      const selects = document.querySelectorAll('select')
      selects.forEach(select => {
        const label =
          document.querySelector(`label[for="${select.id}"]`) ||
          select.closest('.form-group')?.querySelector('label')
        const labelText = label ? label.innerText.trim() : 'Unnamed select'

        const options = Array.from(select.options).map(option => ({
          value: option.value,
          text: option.text
        }))

        results.push({
          elementType: 'select',
          fieldType: 'select',
          id: select.id || null,
          name: select.name || null,
          label: labelText,
          type: 'select',
          required: select.required || false,
          options: options,
          selectedIndex: select.selectedIndex,
          className: select.className || ''
        })
      })

      return results
    })

    console.log(`✅ Found ${formElements.length} form elements:`)
    formElements.forEach(element => {
      console.log(
        `  - ${element.elementType}: ${element.label} (${element.fieldType})`
      )
    })

    // Fill detected input fields (not checkboxes or buttons)
    for (const element of formElements) {
      if (element.elementType === 'input' && element.fieldType === 'text') {
        if (
          element.label.toLowerCase().includes('aadhaar') ||
          element.label.includes('आधार')
        ) {
          await page.type(`#${element.id}`, '12345678910', { delay: 100 })
          console.log(`✅ Filled Aadhaar field: ${element.label}`)
        } else if (
          element.label.toLowerCase().includes('name') ||
          element.label.includes('नाम')
        ) {
          await page.type(`#${element.id}`, 'your name', {
            delay: 100
          })
          console.log(`✅ Filled Name field: ${element.label}`)
        }
      }
    }

    // Check consent checkbox if present
    const consentCheckbox = formElements.find(
      el => el.elementType === 'input' && el.fieldType === 'checkbox'
    )

    if (consentCheckbox && consentCheckbox.id) {
      // await page.click(`#${consentCheckbox.id}`)
      console.log(
        `✅ Checked consent checkbox: ${consentCheckbox.label.substring(
          0,
          50
        )}...`
      )
    }

    await delay(1000)

    // Click the Validate button
    const validateButton = formElements.find(
      el =>
        el.elementType === 'button' &&
        (el.label.toLowerCase().includes('validate') ||
          el.label.toLowerCase().includes('generate') ||
          el.label.toLowerCase().includes('otp'))
    )

    if (validateButton) {
      if (validateButton.id) {
        await page.click(`#${validateButton.id}`)
      } else {
        // Fallback: click by button text
        await page.evaluate(buttonText => {
          const btn = Array.from(
            document.querySelectorAll(
              'button, input[type="submit"], input[type="button"]'
            )
          ).find(b => (b.innerText || b.value || '').includes(buttonText))
          if (btn) btn.click()
        }, validateButton.label)
      }
      console.log(`✅ Clicked validate button: ${validateButton.label}`)
    }

    // Wait for OTP field to appear
    await delay(3000)

    const otpFields = await page.evaluate(() => {
      const results = []
      const labels = document.querySelectorAll('label')

      labels.forEach(label => {
        const text = label.innerText.toLowerCase()
        if (text.includes('otp') || text.includes('ओटीपी')) {
          const input = label.closest('.form-group')?.querySelector('input')
          if (input) {
            results.push({
              elementType: 'input',
              fieldType: 'otp',
              id: input.id || null,
              name: input.name || null,
              label: label.innerText.trim(),
              type: input.type || 'text',
              placeholder: input.placeholder || '',
              required: input.required || false,
              maxLength: input.maxLength > 0 ? input.maxLength : null,
              pattern: input.pattern || '',
              className: input.className || ''
            })
          }
        }
      })
      return results
    })

    if (otpFields.length > 0) {
      console.log(`✅ Found ${otpFields.length} OTP field(s)`)
      formElements.push(...otpFields)
    }

    // Save comprehensive schema
    const outputPath = path.join(OUT_DIR, 'step1_complete.json')
    fs.writeFileSync(outputPath, JSON.stringify(formElements, null, 2))
    console.log(`🎯 Complete Step 1 schema saved to ${outputPath}`)

    // Also save a summary
    const summary = {
      totalElements: formElements.length,
      inputs: formElements.filter(el => el.elementType === 'input').length,
      buttons: formElements.filter(el => el.elementType === 'button').length,
      checkboxes: formElements.filter(el => el.fieldType === 'checkbox').length,
      selects: formElements.filter(el => el.elementType === 'select').length,
      elements: formElements.map(el => ({
        type: el.elementType,
        fieldType: el.fieldType,
        label: el.label,
        id: el.id
      }))
    }

    const summaryPath = path.join(OUT_DIR, 'step1_summary.json')
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2))
    console.log(`📋 Summary saved to ${summaryPath}`)
  } catch (err) {
    console.error('Error scraping Step 1:', err)
  } finally {
    console.log('Scraping Step 1 completed.')
    // Don't close browser immediately to see results
    // await browser.close()
  }
})()
