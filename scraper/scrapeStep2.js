// scraper/scrapeStep2.js
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

    console.log(
      '⚠️ Please manually complete Step 1 (Aadhaar OTP) to reach PAN section...'
    )
    console.log('⏳ Waiting 2 minutes for you to complete Step 1...')
    await delay(120000) // wait for you to reach PAN Verification section

    console.log('🔍 Now scraping PAN section form elements...')

    // Comprehensive form element extraction for Step 2 (PAN section)
    const panFormElements = await page.evaluate(() => {
      const results = []

      // Define PAN section keywords
      const panKeywords = [
        'type of organisation',
        'organisation',
        'संगठन',
        'pan',
        'पैन',
        'name of pan holder',
        'pan holder',
        'धारक का नाम',
        'dob',
        'date of birth',
        'जन्म तिथि',
        'doi',
        'date of incorporation',
        'निगमन की तारीख',
        'gender',
        'लिंग',
        'mobile',
        'मोबाइल',
        'email',
        'ईमेल',
        'verify',
        'validate',
        'सत्यापित'
      ]

      // 1. Input fields (text, number, date, email, etc.)
      const labels = document.querySelectorAll('label')
      labels.forEach(label => {
        const text = label.innerText.toLowerCase().trim()
        const isPanRelated = panKeywords.some(keyword =>
          text.includes(keyword.toLowerCase())
        )

        if (isPanRelated) {
          let input = label
            .closest('.form-group')
            ?.querySelector(
              'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"])'
            )

          // Fallback search methods
          if (!input) {
            input = label.parentElement?.querySelector(
              'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"])'
            )
          }
          if (!input && label.getAttribute('for')) {
            input = document.getElementById(label.getAttribute('for'))
          }

          if (input) {
            results.push({
              elementType: 'input',
              fieldType:
                input.type === 'date'
                  ? 'date'
                  : input.type === 'email'
                  ? 'email'
                  : 'text',
              id: input.id || null,
              name: input.name || null,
              label: label.innerText.trim(),
              type: input.type || 'text',
              placeholder: input.placeholder || '',
              required: input.required || false,
              maxLength: input.maxLength > 0 ? input.maxLength : null,
              minLength: input.minLength > 0 ? input.minLength : null,
              pattern: input.pattern || '',
              value: input.value || '',
              className: input.className || '',
              disabled: input.disabled || false
            })
          }
        }
      })

      // 2. Select dropdowns
      const selects = document.querySelectorAll('select')
      selects.forEach(select => {
        let label = document.querySelector(`label[for="${select.id}"]`)
        if (!label) {
          label = select.closest('.form-group')?.querySelector('label')
        }
        if (!label) {
          label = select.parentElement?.querySelector('label')
        }

        const labelText = label
          ? label.innerText.trim()
          : select.name || 'Unnamed select'
        const isPanRelated = panKeywords.some(keyword =>
          labelText.toLowerCase().includes(keyword.toLowerCase())
        )

        if (isPanRelated || labelText.length > 0) {
          const options = Array.from(select.options).map(option => ({
            value: option.value,
            text: option.text.trim(),
            selected: option.selected
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
            selectedValue: select.value,
            className: select.className || '',
            disabled: select.disabled || false
          })
        }
      })

      // 3. Radio buttons (for gender, organization type, etc.)
      const radioButtons = document.querySelectorAll('input[type="radio"]')
      const radioGroups = new Map()

      radioButtons.forEach(radio => {
        let label = document.querySelector(`label[for="${radio.id}"]`)
        if (!label) {
          label = radio.closest('label')
        }
        if (!label) {
          label = radio.nextElementSibling
        }

        const labelText = label
          ? (label.innerText || label.textContent || '').trim()
          : radio.value || 'Unnamed radio'
        const groupName = radio.name || 'unnamed_group'

        if (!radioGroups.has(groupName)) {
          radioGroups.set(groupName, {
            elementType: 'radiogroup',
            fieldType: 'radio',
            name: groupName,
            label: `Radio Group: ${groupName}`,
            required: radio.required || false,
            options: []
          })
        }

        radioGroups.get(groupName).options.push({
          id: radio.id || null,
          value: radio.value,
          text: labelText,
          checked: radio.checked,
          className: radio.className || '',
          disabled: radio.disabled || false
        })
      })

      // Add radio groups to results
      radioGroups.forEach(group => {
        results.push(group)
      })

      // 4. Checkboxes
      const checkboxes = document.querySelectorAll('input[type="checkbox"]')
      checkboxes.forEach(checkbox => {
        let label = document.querySelector(`label[for="${checkbox.id}"]`)
        if (!label) {
          label = checkbox.closest('label')
        }
        if (!label) {
          label = checkbox.nextElementSibling
        }
        if (!label) {
          label = checkbox.parentElement
        }

        const labelText = label
          ? (label.innerText || label.textContent || '').trim()
          : 'Unnamed checkbox'

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
          className: checkbox.className || '',
          disabled: checkbox.disabled || false
        })
      })

      // 5. Buttons (submit, validate, verify buttons)
      const buttons = document.querySelectorAll(
        'button, input[type="submit"], input[type="button"]'
      )
      buttons.forEach(button => {
        const buttonText =
          button.innerText || button.value || button.textContent || ''
        const isRelevantButton =
          buttonText.toLowerCase().includes('verify') ||
          buttonText.toLowerCase().includes('validate') ||
          buttonText.toLowerCase().includes('submit') ||
          buttonText.toLowerCase().includes('next') ||
          buttonText.toLowerCase().includes('proceed') ||
          buttonText.includes('सत्यापित') ||
          buttonText.trim().length > 0

        if (isRelevantButton) {
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
            disabled: button.disabled || false,
            onclick: button.onclick ? button.onclick.toString() : null
          })
        }
      })

      // 6. Date inputs (specific handling for DOB/DOI)
      const dateInputs = document.querySelectorAll('input[type="date"]')
      dateInputs.forEach(dateInput => {
        let label = document.querySelector(`label[for="${dateInput.id}"]`)
        if (!label) {
          label = dateInput.closest('.form-group')?.querySelector('label')
        }

        const labelText = label ? label.innerText.trim() : 'Date field'

        // Check if already captured in inputs section
        const alreadyCaptured = results.some(r => r.id === dateInput.id)
        if (!alreadyCaptured) {
          results.push({
            elementType: 'input',
            fieldType: 'date',
            id: dateInput.id || null,
            name: dateInput.name || null,
            label: labelText,
            type: 'date',
            required: dateInput.required || false,
            value: dateInput.value || '',
            min: dateInput.min || '',
            max: dateInput.max || '',
            className: dateInput.className || '',
            disabled: dateInput.disabled || false
          })
        }
      })

      return results
    })

    console.log(`✅ Found ${panFormElements.length} PAN section elements:`)
    panFormElements.forEach((element, index) => {
      console.log(
        `  ${index + 1}. ${element.elementType}: ${element.label} (${
          element.fieldType
        })`
      )
    })

    // Save comprehensive schema
    const outputPath = path.join(OUT_DIR, 'step2_complete.json')
    fs.writeFileSync(outputPath, JSON.stringify(panFormElements, null, 2))
    console.log(`🎯 Complete Step 2 schema saved to ${outputPath}`)

    // Create summary
    const summary = {
      totalElements: panFormElements.length,
      inputs: panFormElements.filter(el => el.elementType === 'input').length,
      selects: panFormElements.filter(el => el.elementType === 'select').length,
      buttons: panFormElements.filter(el => el.elementType === 'button').length,
      radioGroups: panFormElements.filter(el => el.elementType === 'radiogroup')
        .length,
      checkboxes: panFormElements.filter(el => el.fieldType === 'checkbox')
        .length,
      dateFields: panFormElements.filter(el => el.fieldType === 'date').length,
      breakdown: {
        textInputs: panFormElements.filter(el => el.fieldType === 'text')
          .length,
        emailInputs: panFormElements.filter(el => el.fieldType === 'email')
          .length,
        dateInputs: panFormElements.filter(el => el.fieldType === 'date')
          .length,
        dropdowns: panFormElements.filter(el => el.fieldType === 'select')
          .length,
        radioButtons: panFormElements.filter(el => el.fieldType === 'radio')
          .length,
        checkboxes: panFormElements.filter(el => el.fieldType === 'checkbox')
          .length,
        buttons: panFormElements.filter(el => el.fieldType === 'button').length
      },
      elements: panFormElements.map(el => ({
        type: el.elementType,
        fieldType: el.fieldType,
        label: el.label,
        id: el.id,
        required: el.required || false
      }))
    }

    const summaryPath = path.join(OUT_DIR, 'step2_summary.json')
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2))
    console.log(`📋 Summary saved to ${summaryPath}`)

    // Also save a simple version for backward compatibility
    const simpleFields = panFormElements
      .filter(el => el.elementType === 'input' || el.elementType === 'select')
      .map(el => ({
        label: el.label,
        tag: el.elementType === 'select' ? 'select' : 'input',
        type: el.type,
        placeholder: el.placeholder || '',
        required: el.required || false,
        maxLength: el.maxLength || null,
        options: el.options || null
      }))

    const legacyPath = path.join(OUT_DIR, 'step2.json')
    fs.writeFileSync(legacyPath, JSON.stringify(simpleFields, null, 2))
    console.log(`🔄 Legacy format saved to ${legacyPath}`)
  } catch (err) {
    console.error('Error scraping Step 2:', err)
  } finally {
    console.log('Scraping Step 2 completed.')
    // Don't close browser to see results
    // await browser.close()
  }
})()
