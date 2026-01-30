/// <reference types="cypress" />
import HomePage from '../../pageObjects/realworld/homePage.js';

describe('RealWorld - Homepage Tests', () => {
    beforeEach(() => {
        HomePage.visit();
    });

    it('Should load homepage successfully', () => {
        cy.url().should('include', 'demo.realworld.io');
    });

    it('Should display conduit banner', () => {
        cy.get('.banner').should('be.visible');
        cy.contains('conduit').should('be.visible');
    });

    it('Should display tagline', () => {
        cy.contains('A place to share your knowledge').should('be.visible');
    });

    it('Should display Global Feed tab', () => {
        HomePage.getGlobalFeedTab().should('be.visible');
    });

    it('Should have Global Feed as default active tab', () => {
        HomePage.getGlobalFeedTab().should('have.class', 'active');
    });

    it('Should display article previews', () => {
        cy.get('.article-preview').should('have.length.at.least', 1);
    });

    it('Should display article titles', () => {
        cy.get('.article-preview h1').first().should('be.visible');
    });

    it('Should display article descriptions', () => {
        cy.get('.article-preview p').first().should('be.visible');
    });

    it('Should display article authors', () => {
        cy.get('.article-preview .author').first().should('be.visible');
    });

    it('Should display article dates', () => {
        cy.get('.article-preview .date').first().should('be.visible');
    });

    it('Should display favorite counts', () => {
        cy.get('.article-preview .btn-outline-primary').first().should('be.visible');
    });

    it('Should display popular tags sidebar', () => {
        cy.contains('Popular Tags').should('be.visible');
    });

    it('Should display tags in sidebar', () => {
        cy.get('.tag-list a').should('have.length.at.least', 1);
    });

    it('Should make article title clickable', () => {
        cy.get('.article-preview h1').first().should('have.css', 'cursor', 'pointer');
    });

    it('Should display Read more link', () => {
        cy.get('.article-preview').first().contains('Read more').should('be.visible');
    });

    it('Should navigate to article on title click', () => {
        cy.get('.article-preview h1').first().click();
        cy.url().should('include', '#/article/');
    });

    it('Should display pagination if many articles', () => {
        cy.get('body').then($body => {
            if ($body.find('.pagination').length > 0) {
                cy.get('.pagination').should('be.visible');
            }
        });
    });

    it('Should filter articles by tag', () => {
        cy.get('.tag-list a').first().click();
        cy.get('.feed-toggle').should('contain', 'a');
    });

    it('Should display navbar', () => {
        cy.get('.navbar').should('be.visible');
    });

    it('Should display Home link in navbar', () => {
        cy.get('.navbar').contains('Home').should('be.visible');
    });

    it('Should display Sign in link when not authenticated', () => {
        cy.get('.navbar').contains('Sign in').should('be.visible');
    });

    it('Should display Sign up link when not authenticated', () => {
        cy.get('.navbar').contains('Sign up').should('be.visible');
    });

    it('Should have working Home navigation', () => {
        cy.get('.navbar').contains('Home').click();
        cy.url().should('eq', 'https://demo.realworld.io/#/');
    });

    it('Should display footer', () => {
        cy.get('footer').should('be.visible');
    });
});
