#include "config.h"

#if HAVE_ASM
#if ARCH_AARCH64
#include "src/arm/64/ipred.S"
#endif
#if ARCH_ARM
#include "src/arm/32/ipred.S"
#endif
#endif
