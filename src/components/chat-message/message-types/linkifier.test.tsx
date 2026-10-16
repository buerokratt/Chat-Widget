import React from 'react';
import { render, screen } from '@testing-library/react';
import Linkifier from './Markdownify';

describe('Linkifier', () => {
  it('should render message link between strings', () => {
    const sentMessage = 'mine palun https://www.google.com/ eerfe';
    const link = 'https://www.google.com/';
    render(<Linkifier message={sentMessage} />);
    expect(screen.getByText(link)).toHaveAttribute('href', link);
  });

  it('should render link with unicode characters', () => {
    const sentMessage = 'mine palun https://bürokröäõatt.ee/ eerfe';
    const link = 'https://bürokröäõatt.ee/';
    render(<Linkifier message={sentMessage} />);
    expect(screen.getByText(link)).toHaveProperty('href');
  });

  it.each`
    correctLink
    ${'https://wwdw.google.com/24ir/dir'}
    ${'https://www.google.com/'}
    ${'https://www.google.com'}
    ${'http://www.google.com'}
  `("should render '$correctLink", async ({ correctLink }) => {
    render(<Linkifier message={correctLink} />);
    expect(screen.getByText(correctLink)).toHaveAttribute('href', correctLink);
  });

  it.each`
    inCorrectLink
    ${'Terekest'}
    ${'https://kasutaja@veebisait.com'}
    ${'http://kasutaja@veebisait.com'}
    ${'https://kasutajatunnus:parool@veebisait.com'}
    ${'https://eesti.ee:mingi-kasutaja-tahelepanu-hajutav-pikk-tekst@p0c.eu'}
    ${'mailto:test@eesti.ee'}

    ${'google.com'}
    ${'ftp://www.google.com'}
    ${'ftps://www.google.com'}
  `("should not render '$inCorrectLink'", async ({ inCorrectLink }) => {
    render(<Linkifier message={inCorrectLink} />);
    expect(screen.getByText(inCorrectLink)).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
  it('does not turn crafted mailto HTML into executable markup', () => {
    const { container } = render(<Linkifier message={'mailto:test@eesti.ee?subject=kiri&html-body=<h1><a%20href="http://eriti-paha-sait.com">KLIKI%20SIIA</a>'} />);
    expect(container).toHaveTextContent('mailto:test@eesti.ee');
    expect(container.querySelector('a, script, h1')).toBeNull();
  });
  it('preserves credential-bearing Markdown labels without a destination', () => {
    render(<Linkifier message="[readable label](https://user:password@example.ee)" />);
    expect(screen.getByText('readable label')).toBeInTheDocument();
    expect(screen.queryByRole('link')).toBeNull();
  });
  it.each(['javascript:alert(1)', 'data:text/html,hello'])('does not activate unsafe Markdown target %s', (href) => {
    const { container } = render(<Linkifier message={`[label](${href})`} />);
    expect(container.querySelector('a[href^="javascript:"], a[href^="data:"], script')).toBeNull();
  });
});
