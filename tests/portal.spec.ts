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
  await page.getByRole('button', { name: 'Geographies' }).click()
  await expect(page.getByText('Geographic Distribution')).toBeVisible()
  await expect(page.getByText('North America')).toBeVisible()
  await page.getByRole('button', { name: 'Business Groups' }).click()
  await expect(page.getByText('Volume Breakdown')).toBeVisible()
  await expect(page.getByText('Submission count per business group')).toBeVisible()
  await page.getByRole('button', { name: 'Product Stages' }).click()
  await expect(page.getByText('Innovation Funnel')).toBeVisible()
  await expect(page.getByText('Count of submissions at each stage')).toBeVisible()
  await page.getByRole('button', { name: 'Lifecycle' }).click()
  await expect(page.getByText('Submission Lifecycle Flow')).toBeVisible()
  await expect(page.getByText('Avg. Days per Stage')).toBeVisible()

  await openNav(page, 'Scoring Guide')
  await expect(page.getByRole('heading', { name: 'Scoring Guide' })).toBeVisible()
  await expect(page.getByText('Score Allocation (Total: 10 pts)')).toBeVisible()

  await openNav(page, 'Users')
  await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible()
  await expect(page.getByText('gurnoor.kahlon@unilever.com')).toBeVisible()
})

test('toolbar popovers and manual submission form open cleanly', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Custom' }).click()
  await expect(page.getByRole('dialog', { name: 'Custom date range' })).toBeVisible()
  await page.getByRole('button', { name: 'Apply range' }).click()

  await page.getByLabel('Sort submissions').click()
  await expect(page.getByRole('menu', { name: 'Sort options' })).toBeVisible()
  await page.getByRole('menuitem', { name: 'UFS Score' }).click()

  await page.getByRole('button', { name: 'Filters' }).click()
  await expect(page.getByRole('dialog', { name: 'Filters' })).toBeVisible()
  await page.getByRole('button', { name: 'Apply' }).click()

  await page.getByLabel('Help').click()
  await expect(page.getByRole('dialog', { name: 'Submissions help' })).toBeVisible()
  await page.getByLabel('Close help').click()

  await page.getByRole('button', { name: /New Manual Submission/i }).click()
  await expect(page.getByRole('heading', { name: 'New manual submission', level: 2 })).toBeVisible()
  await expect(page.getByText('Backfill a submission collected outside the public portal.')).toBeVisible()
  await expect(page.getByText('Corporate R&D experience')).toBeVisible()
})

test('create user modal opens from users view', async ({ page }) => {
  await page.goto('/')
  await openNav(page, 'Users')

  await page.getByRole('button', { name: 'New user' }).click()
  await expect(page.getByRole('dialog', { name: 'Create user' })).toBeVisible()
  await expect(page.getByPlaceholder('someone@unilever.com')).toBeVisible()
})
