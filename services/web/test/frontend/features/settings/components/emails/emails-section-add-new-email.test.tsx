import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EmailsSection from '../../../../../../frontend/js/features/settings/components/emails-section'
import { expect } from 'chai'
import fetchMock from 'fetch-mock'
import { UserEmailData } from '../../../../../../types/user-email'

const userEmailData: UserEmailData = {
  affiliation: {
    cachedConfirmedAt: null,
    cachedPastReconfirmDate: false,
    cachedReconfirmedAt: null,
    department: 'Art History',
    institution: {
      commonsAccount: false,
      confirmed: true,
      id: 1,
      isUniversity: true,
      name: 'Overleaf',
      ssoEnabled: false,
      ssoBeta: false,
    },
    inReconfirmNotificationPeriod: false,
    inferred: false,
    licence: 'pro_plus',
    pastReconfirmDate: false,
    portal: { slug: '', templates_count: 1 },
    role: 'Reader',
  },
  email: 'baz@overleaf.com',
  default: false,
}

describe('<EmailsSection />', function () {
  beforeEach(function () {
    window.metaAttributesCache.set('ol-ExposedSettings', {
      hasAffiliationsFeature: true,
    })
    fetchMock.reset()
  })

  afterEach(function () {
    window.metaAttributesCache = new Map()
    fetchMock.reset()
  })

  it('renders "add another email" button', function () {
    fetchMock.get('/user/emails?ensureAffiliation=true', [])
    render(<EmailsSection />)

    screen.getByRole('button', { name: /add another email/i })
  })

  it('renders input', async function () {
    fetchMock.get('/user/emails?ensureAffiliation=true', [])
    render(<EmailsSection />)

    const addAnotherEmailBtn = (await screen.findByRole('button', {
      name: /add another email/i,
    })) as HTMLButtonElement
    fireEvent.click(addAnotherEmailBtn)

    screen.getByLabelText(/email/i)
  })

  it('renders "add new email" button', async function () {
    fetchMock.get('/user/emails?ensureAffiliation=true', [])
    render(<EmailsSection />)

    const addAnotherEmailBtn = (await screen.findByRole('button', {
      name: /add another email/i,
    })) as HTMLButtonElement
    fireEvent.click(addAnotherEmailBtn)

    screen.getByRole('button', { name: /add new email/i })
  })

  it('adds new email address', async function () {
    fetchMock.get('/user/emails?ensureAffiliation=true', [])
    render(<EmailsSection />)

    await fetchMock.flush(true)
    fetchMock.reset()
    fetchMock
      .get('/user/emails?ensureAffiliation=true', [userEmailData])
      .post('/user/emails', 200)

    const addAnotherEmailBtn = await screen.findByRole('button', {
      name: /add another email/i,
    })

    fireEvent.click(addAnotherEmailBtn)
    const input = screen.getByLabelText(/email/i)

    fireEvent.change(input, {
      target: { value: userEmailData.email },
    })

    const submitBtn = screen.getByRole('button', {
      name: /add new email/i,
    }) as HTMLButtonElement

    expect(submitBtn.disabled).to.be.false

    fireEvent.click(submitBtn)

    expect(submitBtn.disabled).to.be.true

    await waitForElementToBeRemoved(() =>
      screen.getByRole('button', {
        name: /add new email/i,
      })
    )

    screen.getByText(userEmailData.email)
  })

  it('fails to add add new email address', async function () {
    fetchMock.get('/user/emails?ensureAffiliation=true', [])
    render(<EmailsSection />)

    await fetchMock.flush(true)
    fetchMock.reset()
    fetchMock
      .get('/user/emails?ensureAffiliation=true', [])
      .post('/user/emails', 500)

    const addAnotherEmailBtn = screen.getByRole('button', {
      name: /add another email/i,
    })

    fireEvent.click(addAnotherEmailBtn)
    const input = screen.getByLabelText(/email/i)

    fireEvent.change(input, {
      target: { value: userEmailData.email },
    })

    const submitBtn = screen.getByRole('button', {
      name: /add new email/i,
    }) as HTMLButtonElement

    expect(submitBtn.disabled).to.be.false

    fireEvent.click(submitBtn)

    expect(submitBtn.disabled).to.be.true

    await screen.findByText(
      /an error has occurred while performing your request/i
    )
    expect(submitBtn).to.not.be.null
    expect(submitBtn.disabled).to.be.false
  })

  it('adds new email address with existing institution', async function () {
    const country = 'Germany'
    fetchMock.get('/user/emails?ensureAffiliation=true', [])
    render(<EmailsSection />)

    await fetchMock.flush(true)
    fetchMock.reset()

    await userEvent.click(
      screen.getByRole('button', {
        name: /add another email/i,
      })
    )

    await userEvent.type(screen.getByLabelText(/email/i), userEmailData.email)

    await userEvent.click(screen.getByRole('button', { name: /let us know/i }))

    const universityInput = screen.getByRole('textbox', {
      name: /university/i,
    }) as HTMLInputElement

    expect(universityInput.disabled).to.be.true

    fetchMock.get(/\/institutions\/list/, [
      {
        id: userEmailData.affiliation.institution.id,
        name: userEmailData.affiliation.institution.name,
        country_code: 'de',
        departments: [],
      },
    ])

    // Select the country from dropdown
    await userEvent.type(
      screen.getByRole('textbox', {
        name: /country/i,
      }),
      country
    )
    await userEvent.click(screen.getByText(country))

    expect(universityInput.disabled).to.be.false

    await fetchMock.flush(true)
    fetchMock.reset()

    // Select the university from dropdown
    await userEvent.click(universityInput)
    await userEvent.click(
      screen.getByText(userEmailData.affiliation.institution.name)
    )

    const roleInput = screen.getByRole('textbox', { name: /role/i })
    await userEvent.type(roleInput, userEmailData.affiliation.role)
    const departmentInput = screen.getByRole('textbox', { name: /department/i })
    await userEvent.type(departmentInput, userEmailData.affiliation.department)

    fetchMock
      .get('/user/emails?ensureAffiliation=true', [userEmailData])
      .post(/\/user\/emails/, 200)

    await userEvent.click(
      screen.getByRole('button', {
        name: /add new email/i,
      })
    )

    const [[, request]] = fetchMock.calls(/\/user\/emails/)

    expect(JSON.parse(request?.body?.toString() || '{}')).to.deep.equal({
      email: userEmailData.email,
      university: {
        id: userEmailData.affiliation?.institution.id,
      },
      role: userEmailData.affiliation?.role,
      department: userEmailData.affiliation?.department,
    })

    screen.getByText(userEmailData.email)
    screen.getByText(userEmailData.affiliation.institution.name)
    screen.getByText(userEmailData.affiliation.role, { exact: false })
    screen.getByText(userEmailData.affiliation.department, { exact: false })
  })

  it('adds new email address without existing institution', async function () {
    const country = 'Germany'
    const countryCode = 'de'
    const newUniversity = 'Abcdef'
    fetchMock.get('/user/emails?ensureAffiliation=true', [])
    render(<EmailsSection />)

    await fetchMock.flush(true)
    fetchMock.reset()

    await userEvent.click(
      screen.getByRole('button', {
        name: /add another email/i,
      })
    )

    await userEvent.type(screen.getByLabelText(/email/i), userEmailData.email)

    await userEvent.click(screen.getByRole('button', { name: /let us know/i }))

    const universityInput = screen.getByRole('textbox', {
      name: /university/i,
    }) as HTMLInputElement

    expect(universityInput.disabled).to.be.true

    fetchMock.get(/\/institutions\/list/, [
      {
        id: userEmailData.affiliation.institution.id,
        name: userEmailData.affiliation.institution.name,
        country_code: 'de',
        departments: [],
      },
    ])

    // Select the country from dropdown
    await userEvent.type(
      screen.getByRole('textbox', {
        name: /country/i,
      }),
      country
    )
    await userEvent.click(screen.getByText(country))

    expect(universityInput.disabled).to.be.false

    await fetchMock.flush(true)
    fetchMock.reset()

    // Enter the university manually
    await userEvent.type(universityInput, newUniversity)

    const roleInput = screen.getByRole('textbox', { name: /role/i })
    await userEvent.type(roleInput, userEmailData.affiliation.role)
    const departmentInput = screen.getByRole('textbox', { name: /department/i })
    await userEvent.type(departmentInput, userEmailData.affiliation.department)

    const userEmailDataCopy = {
      ...userEmailData,
      affiliation: {
        ...userEmailData.affiliation,
        institution: {
          ...userEmailData.affiliation.institution,
          name: newUniversity,
        },
      },
    }

    fetchMock
      .get('/user/emails?ensureAffiliation=true', [userEmailDataCopy])
      .post(/\/user\/emails/, 200)

    await userEvent.click(
      screen.getByRole('button', {
        name: /add new email/i,
      })
    )

    const [[, request]] = fetchMock.calls(/\/user\/emails/)

    expect(JSON.parse(request?.body?.toString() || '{}')).to.deep.equal({
      email: userEmailData.email,
      university: {
        name: newUniversity,
        country_code: countryCode,
      },
      role: userEmailData.affiliation?.role,
      department: userEmailData.affiliation?.department,
    })

    screen.getByText(userEmailData.email)
    screen.getByText(newUniversity)
    screen.getByText(userEmailData.affiliation.role, { exact: false })
    screen.getByText(userEmailData.affiliation.department, { exact: false })
  })
})