import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import NoPage from '../pages/NoPage';
import { MemoryRouter } from 'react-router-dom';


describe('NoPage:', () => {
  it('Should show all elements.', () => {
    render(
      <MemoryRouter>
        <NoPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('404');
    expect(screen.getByText('Sorry, Page Not Found.')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'To Home Page' })).toBeTruthy();
    expect(screen.getByTestId('linkedin')).toBeTruthy();
    expect(screen.getByTestId('github')).toBeTruthy();
    expect(screen.getByTestId('faq')).toBeTruthy();
  });


  it('Should links navigate to the right pages', () => {
    render(
      <MemoryRouter>
        <NoPage />
      </MemoryRouter>
    );

    const homePageLink = screen.getByRole('link', { name: 'To Home Page' });
    const linkedinLink = screen.getByTestId('linkedin');
    const githubLink = screen.getByTestId('github');
    const faqLink = screen.getByTestId('faq');

    expect(homePageLink.getAttribute('href')).toBe('/');
    expect(linkedinLink.getAttribute('href')).toBe('https://www.linkedin.com/in/mustafaleventfidanci/');
    expect(githubLink.getAttribute('href')).toBe('https://www.github.com/levent-86/');
    expect(faqLink.getAttribute('href')).toBe('/faq');
  });
});
