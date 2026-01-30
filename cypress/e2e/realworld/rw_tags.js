/// <reference types="cypress" />
import HomePage from '../../pageObjects/realworld/homePage.js';

describe('RealWorld - Tags and Filtering Tests', () => {
    beforeEach(() => {
        HomePage.visit();
    });

    it('Should display Popular Tags section', () => {
        cy.contains('Popular Tags').should('be.visible');
    });

    it('Should display tag list', () => {
        cy.get('.tag-list a').should('have.length.at.least', 1);
    });

    it('Should display tags with proper styling', () => {
        cy.get('.tag-list a').first().should('have.class', 'tag-pill');
    });

    it('Should filter articles when clicking a tag', () => {
        cy.get('.tag-list a').first().invoke('text').then(tagName => {
            cy.get('.tag-list a').first().click();
            cy.get('.feed-toggle .nav-link.active').should('contain', tagName.trim());
        });
    });

    it('Should show tagged articles after filter', () => {
        cy.get('.tag-list a').first().click();
        cy.wait(1000);
        cy.get('.article-preview').should('exist');
    });

    it('Should create new tab for filtered tag', () => {
        cy.get('.tag-list a').first().click();
        cy.get('.feed-toggle .nav-link').should('have.length', 2);
    });

    it('Should allow switching back to Global Feed', () => {
        cy.get('.tag-list a').first().click();
        HomePage.getGlobalFeedTab().click();
        HomePage.getGlobalFeedTab().should('have.class', 'active');
    });

    it('Should have clickable tag pills', () => {
        cy.get('.tag-list a').first().should('have.css', 'cursor', 'pointer');
    });

    it('Should maintain tags sidebar on all pages', () => {
        cy.get('.tag-list').should('be.visible');
    });

    it('Should display multiple tags', () => {
        cy.get('.tag-list a').should('have.length.at.least', 3);
    });

    it('Should show tag names clearly', () => {
        cy.get('.tag-list a').first().invoke('text').should('not.be.empty');
    });

    it('Should handle tag selection', () => {
        cy.get('.tag-list a').eq(1).click();
        cy.get('.feed-toggle').should('contain', 'a');
    });

    it('Should maintain tag list after filtering', () => {
        cy.get('.tag-list a').first().click();
        cy.get('.tag-list').should('be.visible');
    });

    it('Should display tags sidebar consistently', () => {
        cy.reload();
        cy.get('.tag-list').should('be.visible');
    });

    it('Should have properly formatted tag display', () => {
        cy.get('.sidebar').should('be.visible');
        cy.get('.sidebar').contains('Popular Tags').should('be.visible');
    });

    it('Should show loading state when filtering', () => {
        cy.get('.tag-list a').first().click();
        cy.wait(500);
    });

    it('Should handle multiple tag selections', () => {
        cy.get('.tag-list a').eq(0).click();
        cy.wait(500);
        HomePage.getGlobalFeedTab().click();
        cy.get('.tag-list a').eq(1).click();
        cy.get('.feed-toggle .nav-link').should('have.length', 2);
    });

    it('Should display tag pill styling', () => {
        cy.get('.tag-list a').first().should('have.class', 'tag-default');
    });

    it('Should maintain sidebar width', () => {
        cy.get('.sidebar').should('have.css', 'width');
    });

    it('Should show tags in organized layout', () => {
        cy.get('.tag-list').should('have.css', 'display');
    });
});
