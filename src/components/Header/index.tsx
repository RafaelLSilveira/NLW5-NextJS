import format from 'date-fns/format'
import ptBr from 'date-fns/locale/pt-BR'

import styles from './styles.module.scss'

function Header() {
    const currentDate = format(new Date, 'EEEEEE, d MMMM', {
        locale: ptBr
    })

    return (
        <header className={ styles.headerContainer }>
            <img src="/Logo.svg" alt="Podcastr"></img>

            <p>O melhor para voçê ouvir, sempre</p>

            <span>{currentDate}</span>
        </header>
    )
}

export default Header