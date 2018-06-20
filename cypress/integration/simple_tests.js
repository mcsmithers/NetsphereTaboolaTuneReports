/// <reference types="Cypress" />

context('Actions', () => {
    beforeEach(() => {
        cy.visit('https://localhost:8080')
    })

    it('.click() - click on a DOM element', () => {
        // https://on.cypress.io/click
        cy.get('.exportExcelButton').click()

        it('.scrollIntoView() - scroll an element into view', () => {
            // https://on.cypress.io/scrollintoview

            cy.get('.tfoot')
                .should('.be.visible')

            it('cy.scrollTo() - scroll the window or element to a position', () => {

                // or you can scroll to a specific coordinate:
                // (x axis, y axis) in pixels
                cy.get('#scrollable-vertical').scrollTo(250, 250)

                // or you can scroll to a specific percentage
                // of the (width, height) of the element
                cy.get('#scrollable-both').scrollTo('75%', '25%')

                // control the easing of the scroll (default is 'swing')
                cy.get('#scrollable-vertical').scrollTo('center', { easing: 'linear' })

                // control the duration of the scroll (in ms)
                cy.get('#scrollable-both').scrollTo('center', { duration: 2000 })
            })
        })
    })
})