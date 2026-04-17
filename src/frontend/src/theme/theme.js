import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        background: {
            main: '#C5D3D9',
            body: '#FFFFFF',
        },
        text: {
            primary: '#000',
            secondary: '#347EBF',
        },
        especials: {
            blue: '#347EBF',
            red: '#B23A3A'
        },
        messages: {
            sucess: '#10B981',
            error: '#D93B3B',
        },
        tasks: {
          pendente: '#3B82F6',
          pendenteOpacity: '#3B82F622',
          pendenteIcon: '#93C5FD66',   // azul mais suave
          
          andamento: '#228B22',
          andamentoOpacity: '#228B2222',
          andamentoIcon: '#86EFAC',  // verde suave
          
          concluida: '#B23A3A',            
          concluidaOpacity: '#B23A3A22',
          concluidaIcon: '#FCA5A5',  // vermelho suave
          
          abandonada: '#4B5563',
          abandonadaOpacity: '#4B556322',
          abandonadaIcon: '#D1D5DB'  // cinza suave
        },
        urgency: {
          Baixa: "#DC2626",
          Média: "#D97706",
          Alta: "#0284C7",
          Concluida: "#16A34A",
          Abandonada: "#4B5563"
        },
        urgencyBackground: {
          Baixa: "#FCA5A5",   
          Média: "#FCD34D",  
          Alta: "#7DD3FC", 
          Concluida: "#86EFAC" ,
          Abandonada: "#D1D5DB"
        }
  },

    typography: {
        fontFamily: `'Inter', 'Montserrat', 'Roboto', 'Arial', sans-serif`,
        h2: {
          fontFamily: `'Montserrat', sans-serif`,
          fontSize: 24,
          fontWeight: 800,
          color: '#347EBF',
          margin: '24px 0',
        },
        h1Login: {
          fontFamily: `'Montserrat', sans-serif`,
          fontSize: 42,
          fontWeight: 800,
          color: '#347EBF',
          margin: '0 0 42px 0'
        },
        h1Header: {
          fontFamily: `'Montserrat', sans-serif`,
          fontSize: 42,
          fontWeight: 800,
          color: '#347EBF',
          '@media (min-width:1200px)': {
            margin: '42px'
          },
          '@media (max-width:1199.95px)': {
            margin: '24px 0'
          }
        }
    },

    components: {
        MuiTypography: {
            variants: [
                {
                    props: { variant: 'text' },
                    style: {
                        fontFamily: `'Inter', sans-serif`,
                        fontSize: 16,
                        color: '#000',   
                        lineHeight: 1.8,
                        marginBottom: 16,
                    },
                },
                {
                  props: { variant: 'note' },
                  style: {
                      fontFamily: `'Inter', sans-serif`,
                      fontSize: 25,
                      color: '#000',   
                      lineHeight: 1.8,
                  },
                },
                {
                  props: { variant: 'small' },
                  style: {
                      fontFamily: `'Inter', sans-serif`,
                      fontSize: 12,
                      fontStyle: 'italic',
                      color: 'gray',   
                  },
                },
                {
                  props: { variant: 'done' },
                  style: {
                      fontFamily: `'Inter', sans-serif`,
                      fontSize: 14,
                      color: 'grey',   
                      lineHeight: 1.8,
                      marginBottom: 16,
                      textDecoration:'line-through'
                  },
                },
                {
                    props: { variant: 'error'},
                    style: {
                        fontFamily: `'Inter', sans-serif`,
                        fontSize: 14,
                        fontWeight: 800,
                        color: '#D93B3B',   
                        lineHeight: 1.8,
                        marginBottom: 16,
                    }
                },
                {
                  props: { variant: 'title'},
                    style: {
                        fontFamily: `'Montserrat', sans-serif`,
                        fontSize: 16,
                        color: '#fff',   
                        lineHeight: 1.8,
                    }
                },                {
                  props: { variant: 'number' },
                  style: {
                      fontFamily: `'Inter', sans-serif`,
                      fontSize: 42,
                      color: '#fff',   
                      lineHeight: 1.8,
                      fontWeight: 800,
                  },
                },
                //Error Page
                {
                  props: { variant: 'error404Title' },
                  style: {
                    fontFamily: `'Montserrat', sans-serif`,
                    fontWeight: 800,
                    fontSize: 'clamp(80px, 15vw, 180px)',
                    color: '#B23A3A',
                    textAlign: 'center',
                    lineHeight: 1,
                    marginBottom: 42,
                  }
                },
                {
                  props: { variant: 'error404Subtitle' },
                  style: {
                    fontFamily: `'Inter', sans-serif`,
                    fontWeight: 500,
                    fontSize: 18,
                    color: '#333333',
                    textAlign: 'center',
                    marginBottom: 24,
                  }
                },
                {
                  props: { variant: 'error404Text' },
                  style: {
                    fontFamily: `'Inter', sans-serif`,
                    fontSize: 14,
                    color: '#555555',
                    textAlign: 'center',
                    maxWidth: 400,
                    margin: '0 auto',
                  }
                },
                {
                  props: { variant: 'sucess'},
                    style: {
                        fontFamily: `'Inter', sans-serif`,
                        fontSize: 14,
                        fontWeight: 800,
                        color: '#10B981',   
                        lineHeight: 1.8,
                        marginBottom: 16,
                    }
                }
            ]
        },

        MuiTextField: {
          defaultProps: {
            variant: 'outlined',
            fullWidth: true,
          }
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              backgroundColor: '#FFFFFF',
              marginBottom: 24,
            
              '& fieldset': {
                borderColor: '#347EBF'
              },
    
              '&:hover fieldset': {
                borderColor: '#2F8F5B'
              },
    
              '&.Mui-focused fieldset': {
                borderColor: '#347EBF'
              }
            },

            input: {
                fontSize: '14px',   
                padding: '15px 12px'
            }
          }
        },
        MuiButton: {
            defaultProps: {
              variant: 'contained',
              disableElevation: true,
              fullWidth: true
            },
            styleOverrides: {
              root: {
                borderRadius: 25,
                padding: '12px',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
              },
            },
            variants: [
                {
                  props: { variant: 'primary' },
                  style: {
                    backgroundColor: '#B23A3A',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#323A3A'
                    }
                  }
                },
                {
                    props: { variant: 'edit' },
                    style: {
                        backgroundColor: '#2F8F5B',
                        color: '#fff',
                        '&:hover': {
                        backgroundColor: '#26754A'
                        }
                    }
                },
                {
                  props: { variant: 'del' },
                  style: {
                      backgroundColor: '#A64444',
                      color: '#fff',
                      '&:hover': {
                      backgroundColor: '#823535'
                      }
                  }
              },
            ]
        },
        MuiIconButton: {
          defaultProps: {
            size: 'medium',
          },
          styleOverrides: {
            root: {
              padding: 12,
              borderRadius: '50%',       
              transition: 'all 0.2s ease',
            },
          },
        },
        MuiMenu: {
          styleOverrides: {
            paper: {
              backgroundColor: '#FFFFFF',      
              borderRadius: 12,                
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              minWidth: 180,
              padding: 8,
            },
          },
        },
        MuiMenuItem: {
          styleOverrides: {
            root: {
              fontFamily: `'Inter', sans-serif`,
              fontSize: 14,
              color: '#000000',
              borderRadius: 8,
              padding: '10px 16px',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#347EBF',   
                color: '#FFFFFF',
              },
            },
          },
        },
    },
});


export default theme;