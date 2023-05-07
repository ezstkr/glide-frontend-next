import styled from 'styled-components';


const ResultPageDiv = styled.div`
& {
    font-family: var(--font-inter);
    color: #000000;

    #result-title {
        height: 288px;

        .col-a-center {
            gap: 12px;
        }
    }
    
    #result-detail {
        padding: 32px;
    
        .container {
            max-width: 1024px;
            gap: 32px;
        }
    }
}

h2 {
    font-weight: 400;
    font-size: 24px;
    line-height: 32px;
}
h1 {
    font-weight: 700;
    font-size: 36px;
    line-height: 40px;
}
h4 {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
}
h3 {
    font-weight: 700;
    font-size: 30px;
    line-height: 36px;
}
h5 {
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
}
p {
    font-size: 16px;
    line-height: 24px;
}

#your-score {
    #total-score {
        width: 145px;
        gap: 8px;

        .row-a-end {
            gap: 8px;

            p {
                width: 55px;
                font-weight: 600;
                color: #6B7280;
            }
        }
    }
}

#analysis {
    .columns {
        @media screen and (max-width: 768px) {
            display: flex;
            flex-direction: column;
        }

        gap: 20px;

        p {
            font-weight: 500;
            min-height: 72px;
        }
    }

    .tag-custom {
        width: 75px;
        height: 28px;

        padding: 2px 8px;
        border-radius: 14px;

        font-weight: 600;
        font-size: 18px;
        line-height: 24px;
        color: white;
        background-color: #EF4444;
    }

    #bottom {
        color: #6B7280;

        a {
            color: #3B82F6 !important;

            &:hover {
                opacity: 0.7;
            }
        }
    }
}
`

export default ResultPageDiv;
