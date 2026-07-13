import { expect, test } from '@playwright/test'

async function openNav(page: import('@playwright/test').Page, label: string) {
  if (page.viewportSize() && page.viewportSize()!.width <= 820) {
    await page.getByLabel('Open menu').click()
  }
  await page.getByRole('button', { name: label }).click()
}

test('submissions list supports search and details', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Submissions' })).toBeVisible()
  await expect(page.getByText('GreenShield Surfactant Platform')).toBeVisible()

  await page.getByPlaceholder('Search by name or company...').fill('skinai')
  await expect(page.getByText('SkinAI Diagnostic Platform')).toBeVisible()
  await expect(page.getByText('Fermento Base')).toBeHidden()

  await page.getByPlaceholder('Search by name or company...').fill('')
  await page.getByText('GreenShield Surfactant Platform').click()
  await expect(page.getByRole('dialog', { name: 'GreenShield Surfactant Platform' })).toBeVisible()
  await expect(page.getByText('Reviewer summary')).toBeVisible()
})

test('core navigation views render', async ({ page }) => {
  await page.goto('/')

  await openNav(page, 'Insights')
  await expect(page.getByRole('heading', { name: 'Insights' })).toBeVisible()
  await expect(page.getByText('Submission Trend')).toBeVisible()

  await openNav(page, 'Scoring Guide')
  await expect(page.getByRole('heading', { name: 'Scoring Guide' })).toBeVisible()
  await expect(page.getByText('Score Allocation (Total: 10 pts)')).toBeVisible()

  await openNav(page, 'Users')
  await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible()
  await expect(page.getByText('gurnoor.kahlon@unilever.com')).toBeVisible()
})

test('filters and manual submission modal open cleanly', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Filters' }).click()
  await expect(page.getByRole('dialog', { name: 'Filters' })).toBeVisible()
  await page.getByRole('button', { name: 'Apply filters' }).click()

  await page.getByRole('button', { name: /New Manual Submission/i }).click()
  await expect(page.getByRole('dialog', { name: 'New manual submission' })).toBeVisible()
  await expect(page.getByPlaceholder('Company Inc.')).toBeVisible()
})
