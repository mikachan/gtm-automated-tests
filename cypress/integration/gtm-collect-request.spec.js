/// <reference types="cypress" />

Cypress.on('window:before:load', (win) => {
  win.ga = cy.stub().as('ga')
})

context('GTM Collect Network Request', () => {
  // it('cy.request() with query parameters', () => {
  //   // will execute request
  //   // https://jsonplaceholder.cypress.io/comments?postId=1&id=3
  //   cy.request({
  //     url: 'https://jsonplaceholder.cypress.io/comments',
  //     qs: {
  //       postId: 1,
  //       id: 3,
  //     },
  //   })
  //   .its('body')
  //   .should('be.an', 'array')
  //   .and('have.length', 1)
  //   .its('0') // yields first element of the array
  //   .should('contain', {
  //     postId: 1,
  //     id: 3,
  //   })
  // })

  it('should make a call to ga/collect for each GA event', () => {
    cy.intercept(/.*\/collect\?.*t=event.*/g).as('collectEvent')
    cy.visit('https://ao.com/l/washing_machines-free_standing/1-9/1/')
    cy.wait('@collectEvent').should(({ request, response }) => {
      expect(response.statusCode).to.be.oneOf([200, 304]) // checks that GA responded successfully
      expect(request.url).to.include('event') // this string can be anything you want to test for in the response URL
    })
  })

  it('should make correct calls to GA', () => {
    cy.visit('https://ao.com/l/washing_machines-free_standing/1-9/1/')
    cy.wait(2000)

    cy.get('@ga')
      .should('be.calledWith', 'create', 'UA-52716266-1') // replace with UA that you want to test for
      .and('be.calledWithMatch', /.+send/, 'pageview') // can be replaced with any type of event that's sent to GA, e.g. events from DY, data library etc
      
      // trigger DY event
      //cy.get('@ga')
      //.should('be.calledWithMatch', /.+ec:DY Smart Action/)
  })
})
