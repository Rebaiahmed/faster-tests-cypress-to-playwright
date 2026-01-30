/// <reference types="cypress" />
import HomePage from '../../pageObjects/realworld/homePage.js';
import AuthPage from '../../pageObjects/realworld/authPage.js';

describe('RealWorld - Navigation Tests', () => {
    beforeEach(() => {
        HomePage.visit();
    });

    it('Should display main navigation bar', () => {
        cy.get('.navbar').should('be.visible');
    });

    it('Should display conduit logo', () => {
        cy.get('.navbar-brand').should('contain', 'conduit');
    });

    it('Should navigate to home via logo', () => {
        AuthPage.visitLogin();
        cy.get('.navbar-brand').click();
        cy.url().should('eq', 'https://demo.realworld.io/#/');
    });

    it('Should navigate to home via Home link', () => {
        AuthPage.visitLogin();
        cy.get('.navbar').contains('Home').click();
        cy.url().should('eq', 'https://demo.realworld.io/#/');
    });

    it('Should navigate to sign in page', () => {
        cy.get('.navbar').contains('Sign in').click();
        cy.url().should('include', '#/login');
    });

    it('Should navigate to sign up page', () => {
        cy.get('.navbar').contains('Sign up').click();
        cy.url().should('include', '#/register');
    });

    it('Should have correct navigation items when logged out', () => {
        cy.get('.navbar .nav-link').should('have.length.at.least', 3);
    });

    it('Should highlight active navigation item', () => {
        cy.get('.navbar').contains('Home').should('have.class', 'active');
    });

    it('Should maintain navigation across pages', () => {
        AuthPage.visitLogin();
        cy.get('.navbar').should('be.visible');
        cy.get('.navbar').contains('Home').should('be.visible');
    });

    it('Should have responsive navigation', () => {
        cy.viewport(375, 667);
        cy.get('.navbar').should('be.visible');
    });

    it('Should display footer on all pages', () => {
        cy.get('footer').should('be.visible');
        AuthPage.visitLogin();
        cy.get('footer').should('be.visible');
    });

    it('Should navigate using browser back button', () => {
        AuthPage.visitLogin();
        cy.go('back');
        cy.url().should('eq', 'https://demo.realworld.io/#/');
    });

    it('Should navigate using browser forward button', () => {
        AuthPage.visitLogin();
        cy.go('back');
        cy.go('forward');
        cy.url().should('include', '#/login');
    });

    it('Should have working links in navigation', () => {
        cy.get('.navbar a').each($link => {
            cy.wrap($link).should('have.attr', 'href');
        });
    });

    it('Should display navigation consistently', () => {
        cy.reload();
        cy.get('.navbar').should('be.visible');
    });

    it('Should handle multiple navigation clicks', () => {
        cy.get('.navbar').contains('Sign in').click();
        cy.get('.navbar').contains('Home').click();
        cy.get('.navbar').contains('Sign up').click();
        cy.url().should('include', '#/register');
    });

    it('Should maintain URL structure', () => {
        cy.url().should('match', /^https:\/\/demo\.realworld\.io\/#\//);
    });

    it('Should have accessible navigation links', () => {
        cy.get('.navbar a').each($link => {
            cy.wrap($link).should('be.visible');
        });
    });

    it('Should preserve navigation state on refresh', () => {
        AuthPage.visitLogin();
        cy.reload();
        cy.url().should('include', '#/login');
    });

    it('Should handle rapid navigation changes', () => {
        for(let i = 0; i < 3; i++) {
            cy.get('.navbar').contains('Sign in').click();
            cy.get('.navbar').contains('Home').click();
        }
        cy.url().should('eq', 'https://demo.realworld.io/#/');
    });
});
