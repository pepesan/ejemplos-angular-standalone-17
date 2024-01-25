import {render, screen, fireEvent} from '@testing-library/angular'
import { AppComponent } from './app.component';

describe('App Testing Library', () => {
  it('should render App title', async () => {
    await render(AppComponent, {
      componentProperties: {title : 'proyecto'},
    })

    expect(screen.findByText('proyecto')).toBeDefined()
  })
  //
  // it('should increment the counter on click', async () => {
  //   await render(CounterComponent, {
  //     componentProperties: {counter: 5},
  //   })
  //
  //   fireEvent.click(screen.getByText('+'))
  //
  //   expect(screen.getByText('Current Count: 6')).toBeInTheDocument()
  // })
})
