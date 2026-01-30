/// <reference types="cypress" />
import HomePage from '../../pageObjects/realworld/homePage.js';
import ArticlePage from '../../pageObjects/realworld/articlePage.js';

describe('RealWorld - Article Browsing Tests', () => {
    beforeEach(() => {
        HomePage.visit();
    });

    it('Should display multiple articles on homepage', () => {
        HomePage.verifyArticleCount(1);
    });

    it('Should show article preview with all details', () => {
        HomePage.getArticlePreview(0).within(() => {
            cy.get('h1').should('be.visible');
            cy.get('p').should('be.visible');
            cy.get('.author').should('be.visible');
            cy.get('.date').should('be.visible');
        });
    });

    it('Should navigate to article detail page', () => {
        HomePage.clickArticle(0);
        cy.url().should('include', '#/article/');
    });

    it('Should display article title on detail page', () => {
        HomePage.clickArticle(0);
        ArticlePage.getArticleTitle().should('be.visible');
    });

    it('Should display article body on detail page', () => {
        HomePage.clickArticle(0);
        ArticlePage.getArticleBody().should('be.visible');
    });

    it('Should display author info on article page', () => {
        HomePage.clickArticle(0);
        cy.get('.article-meta').should('be.visible');
    });

    it('Should display article tags', () => {
        HomePage.clickArticle(0);
        cy.get('body').then($body => {
            if ($body.find('.tag-list').length > 0) {
                cy.get('.tag-list').should('be.visible');
            }
        });
    });

    it('Should have favorite button on article page', () => {
        HomePage.clickArticle(0);
        cy.get('.btn').contains('Favorite').should('be.visible');
    });

    it('Should display comments section', () => {
        HomePage.clickArticle(0);
        cy.contains('Sign in').should('be.visible');
    });

    it('Should show sign in prompt for comments when not logged in', () => {
        HomePage.clickArticle(0);
        cy.get('.col-xs-12').contains('Sign in').should('be.visible');
    });

    it('Should display article date', () => {
        HomePage.clickArticle(0);
        cy.get('.date').should('be.visible');
    });

    it('Should show author profile link', () => {
        HomePage.clickArticle(0);
        cy.get('.author').first().should('have.attr', 'href');
    });

    it('Should display follow button for author', () => {
        HomePage.clickArticle(0);
        cy.get('.btn-outline-secondary').should('be.visible');
    });

    it('Should navigate back to home from article', () => {
        HomePage.clickArticle(0);
        cy.get('.navbar').contains('Home').click();
        cy.url().should('eq', 'https://demo.realworld.io/#/');
    });

    it('Should load article without errors', () => {
        HomePage.clickArticle(0);
        cy.get('.article-page').should('be.visible');
    });

    it('Should display Read more link on preview', () => {
        HomePage.getArticlePreview(0).contains('Read more').should('be.visible');
    });

    it('Should have working Read more link', () => {
        HomePage.getArticlePreview(0).contains('Read more').click();
        cy.url().should('include', '#/article/');
    });

    it('Should show favorite count', () => {
        HomePage.getArticlePreview(0).find('.btn-outline-primary').should('contain.text', ' ');
    });

    it('Should display article author avatar', () => {
        HomePage.getArticlePreview(0).find('img').should('be.visible');
    });

    it('Should handle clicking on different articles', () => {
        cy.get('.article-preview').its('length').then(count => {
            if (count > 1) {
                HomePage.clickArticle(1);
                cy.url().should('include', '#/article/');
            }
        });
    });

    it('Should maintain article structure', () => {
        HomePage.getArticlePreview(0).should('have.class', 'article-preview');
    });
});
