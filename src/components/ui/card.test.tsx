import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from './card'

describe('Card', () => {
  it('renderiza con data-slot="card"', () => {
    render(<Card data-testid="card">contenido</Card>)
    const el = screen.getByTestId('card')
    expect(el).toHaveAttribute('data-slot', 'card')
  })

  it('aplica size default', () => {
    render(<Card data-testid="card">contenido</Card>)
    expect(screen.getByTestId('card')).toHaveAttribute('data-size', 'default')
  })

  it('aplica size sm', () => {
    render(<Card data-testid="card" size="sm">contenido</Card>)
    expect(screen.getByTestId('card')).toHaveAttribute('data-size', 'sm')
  })

  it('pasa className adicional', () => {
    render(<Card data-testid="card" className="custom">contenido</Card>)
    expect(screen.getByTestId('card')).toHaveClass('custom')
  })
})

describe('CardHeader', () => {
  it('renderiza con data-slot="card-header"', () => {
    render(<CardHeader data-testid="header">titulo</CardHeader>)
    expect(screen.getByTestId('header')).toHaveAttribute('data-slot', 'card-header')
  })
})

describe('CardTitle', () => {
  it('renderiza con data-slot="card-title"', () => {
    render(<CardTitle data-testid="title">Mi titulo</CardTitle>)
    const el = screen.getByTestId('title')
    expect(el).toHaveAttribute('data-slot', 'card-title')
    expect(el).toHaveTextContent('Mi titulo')
  })
})

describe('CardDescription', () => {
  it('renderiza con data-slot="card-description"', () => {
    render(<CardDescription data-testid="desc">Descripcion</CardDescription>)
    expect(screen.getByTestId('desc')).toHaveAttribute('data-slot', 'card-description')
  })
})

describe('CardAction', () => {
  it('renderiza con data-slot="card-action"', () => {
    render(<CardAction data-testid="action">accion</CardAction>)
    expect(screen.getByTestId('action')).toHaveAttribute('data-slot', 'card-action')
  })
})

describe('CardContent', () => {
  it('renderiza con data-slot="card-content"', () => {
    render(<CardContent data-testid="content">body</CardContent>)
    expect(screen.getByTestId('content')).toHaveAttribute('data-slot', 'card-content')
  })
})

describe('CardFooter', () => {
  it('renderiza con data-slot="card-footer"', () => {
    render(<CardFooter data-testid="footer">pie</CardFooter>)
    expect(screen.getByTestId('footer')).toHaveAttribute('data-slot', 'card-footer')
  })
})
