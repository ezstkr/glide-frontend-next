import styled from 'styled-components';


export const QuestionPageDiv = styled.div`
gap: 32px;
margin: 32px 0;

h1 {
    font-family: var(--font-inter);
    font-weight: 600;
    font-size: 1.5rem;
}

.page {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0px;
    gap: 18px;

    @media screen and (max-width: 1376px) {
      width: 100% !important;
      flex-direction: column;
    }
    width: 1376px;
    min-height: 632px;

    .page-item {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        padding: 64px;
        gap: 32px;

        @media screen and (max-width: calc(679px * 2)) {
          padding: 32px;
          width: 100% !important;
          height: unset;
        }
        width: 679px;
        height: 632px;
        overflow-y: scroll;
        
        background: #FFFFFF;
        
        box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06);
    }

    &.checked .page-item {
        padding: 32px;
        
        #answer {
            width: 100%;
        }

        #answer-info {
            color: #5B5C61;
            font-size: 12px;
            font-weight: 500;
            font-family: var(--font-inter);

            .col-j-end {
                font-size: 14px;
                margin-left: 67px;
            }

            i.tag {
                width: 12px;
                height: 12px;
                padding: 0;
                margin-right: 0.5rem;
    
                &.is-light {
                    width: 40px;
                }
            }
        }
        

    }
}

#question, #subtopic {
    font-weight: 700;
    font-size: 18px;
    line-height: 24px;

    color: #000000;

    i.has-text-danger {
        font-size: 1.5rem;
        margin: 0 2.5rem 0 0.5rem;
    }
}

#choices {
    gap: 32px;

    input[type="radio"] {
        font-family: var(--font-inter);
        font-weight: 400;
        line-height: 24px;

        border-radius: 2px;
        font-size: 0.75rem;
        margin-right: 0.5em;
    }

    label {
        cursor: pointer;
        font-size: 18px;
    }

}

#choices-checked {
    gap: 16px;

    .choice {
        border-radius: 0.25rem;
    }

    .tag {
        span {
            position: relative;
            right: 2px;
        }

        &:not(.is-success, .is-danger) {
            color: black
        }
    }
}


#explanation {
    font-weight: 500;

    .subtitle {
        font-size: 1rem;
    }
}

#article {
    font-family: var(--font-inter);
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;

    color: #000000;

    #article-url {
        font-size: 1rem;
        padding: 0.5rem 1rem;
        border-radius: 2rem;

        a {
            color: #3B82F6 !important;

            &:hover {
                opacity: 0.7;
            }
        }
    }
}

.checked #article {
    font-size: 16px;

    span {
      &.green {
        background-color: #EAF7E4;
      }
      &.red {
        background-color: #F6DFDE;
      }
    }
}

#btn-check {
    width: 180px;
    height: 40px;
    
    background: #5076CB;
    
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
    border-radius: 20px;

    font-family: var(--font-inter);
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
}
`