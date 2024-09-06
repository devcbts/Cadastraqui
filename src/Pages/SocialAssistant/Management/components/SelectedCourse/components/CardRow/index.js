import Card from "Components/Card";

export default function CardsRow({
    title,
    cards = [{ desc: '', value: '' }]
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4>{title}</h4>
            <div style={{ display: 'flex', flexDirection: 'row', flexBasis: '25%', flexWrap: 'wrap', gap: '16px' }}>

                {
                    cards.map(card => (
                        <Card.Root>
                            <Card.Title text={card.desc} />
                            <Card.Content>{card.value}</Card.Content>
                        </Card.Root>
                    ))
                }
            </div>
        </div>
    )
}